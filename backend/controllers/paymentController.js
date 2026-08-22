const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const { getProducts } = require("../routes/productRoutes");
const { sendOrderEmail } = require("../utils/orderEmail");

let razorpayInstance = null;

function getRazorpayInstance() {
  if (razorpayInstance) return razorpayInstance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env"
    );
  }

  razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayInstance;
}

// Recalculate the order total on the server from trusted product prices,
// rather than trusting the amount sent from the frontend. This prevents
// price tampering from the client side.
function calculateTrustedTotal(items = []) {
  let subtotal = 0;

  for (const cartItem of items) {
    const product = getProducts().find((p) => p.id === cartItem.id);
    if (!product) continue;
    const quantity = Math.max(1, Number(cartItem.quantity) || 1);
    subtotal += product.price * quantity;
  }

  const delivery = subtotal >= 500 || subtotal === 0 ? 0 : 40;
  const total = subtotal + delivery;
  return { subtotal, delivery, total };
}

// POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const { total } = calculateTrustedTotal(items);

    if (total <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: Math.round(total * 100), // amount in paise
      currency: "INR",
      receipt: `iniya_${Date.now()}`,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create order error:", err.message);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

// POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !customer ||
      !Array.isArray(items)
    ) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new Error("RAZORPAY_KEY_SECRET is not configured");
    }

    // Verify the payment signature — this is the critical security step.
    // Never trust the frontend's claim that payment succeeded.
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValidSignature = expectedSignature === razorpay_signature;

    if (!isValidSignature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Recompute totals server-side from trusted product prices.
    const { subtotal, delivery, total } = calculateTrustedTotal(items);

    const order = await Order.create({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      customer,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        weight: item.weightLabel || item.weight,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      delivery,
      total,
      paymentStatus: "paid",
    });

    sendOrderEmail(order).catch((emailError) =>
      console.error("Order email error:", emailError.message)
    );

    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error("Verify payment error:", err.message);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
