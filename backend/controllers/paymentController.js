const crypto = require("crypto");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendOrderEmail } = require("../utils/orderEmail");

let razorpayInstance = null;

function getRazorpayInstance() {
  if (razorpayInstance) return razorpayInstance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET"
    );
  }

  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayInstance;
}

// ----------------------------------------------------
// Calculate trusted total from database prices
// ----------------------------------------------------
async function calculateTrustedTotal(items = []) {
  const validIds = items
    .map((item) => item.id)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  const products = await Product.find({
    _id: { $in: validIds },
  });

  const productMap = new Map(
    products.map((product) => [String(product._id), product])
  );

  let subtotal = 0;

  for (const cartItem of items) {
    const product = productMap.get(String(cartItem.id));

    if (!product) continue;

    const quantity = Math.max(
      1,
      Number(cartItem.quantity) || 1
    );

    subtotal += product.price * quantity;
  }

  const delivery =
    subtotal >= 500 || subtotal === 0
      ? 0
      : 40;

  const total = subtotal + delivery;

  return {
    subtotal,
    delivery,
    total,
  };
}

// ====================================================
// CREATE RAZORPAY ORDER
// POST /api/payment/create-order
// ====================================================
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    const { total } = await calculateTrustedTotal(items);

    if (total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    const razorpay = getRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `iniya_${Date.now()}`,
    });

    console.log(
      "✅ Razorpay order created:",
      razorpayOrder.id
    );

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error(
      "❌ Create order error:",
      err.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
};

// ====================================================
// VERIFY PAYMENT
// POST /api/payment/verify
// ====================================================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
    } = req.body;

    // ------------------------------------------------
    // Validate request
    // ------------------------------------------------
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !customer ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    // ------------------------------------------------
    // Razorpay secret
    // ------------------------------------------------
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error(
        "RAZORPAY_KEY_SECRET is not configured"
      );
    }

    // ------------------------------------------------
    // Verify Razorpay signature
    // ------------------------------------------------
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const isValidSignature =
      expectedSignature === razorpay_signature;

    if (!isValidSignature) {
      console.error(
        "❌ Invalid Razorpay payment signature"
      );

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    console.log(
      "✅ Razorpay payment signature verified"
    );

    // ------------------------------------------------
    // Calculate trusted totals
    // ------------------------------------------------
    const {
      subtotal,
      delivery,
      total,
    } = await calculateTrustedTotal(items);

    // ------------------------------------------------
    // Create order in MongoDB
    // ------------------------------------------------
    const order = await Order.create({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,

      customer,

      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        weight:
          item.weightLabel || item.weight,
        price: item.price,
        quantity: item.quantity,
      })),

      subtotal,
      delivery,
      total,

      paymentStatus: "paid",
    });

    console.log(
      "✅ Order saved:",
      order._id.toString()
    );

    // =================================================
    // SEND EMAIL TO ADMIN + CUSTOMER
    // =================================================

    try {
      console.log(
        "📧 Sending order emails..."
      );

      const emailResults =
        await sendOrderEmail(order);

      emailResults.forEach((result, index) => {
        const recipient =
          index === 0
            ? "ADMIN"
            : "CUSTOMER";

        if (result.status === "fulfilled") {
          console.log(
            `✅ ${recipient} email sent successfully`
          );
        } else {
          console.error(
            `❌ ${recipient} email failed:`,
            result.reason?.message ||
              result.reason
          );
        }
      });

      console.log(
        "📧 Email process completed"
      );
    } catch (emailError) {
      // Email failure should NOT make the paid
      // order appear to be a failed payment.
      console.error(
        "❌ Order email error:",
        emailError.message
      );
    }

    // ------------------------------------------------
    // Return successful response
    // ------------------------------------------------
    return res.json({
      success: true,
      message:
        "Payment verified and order placed successfully",
      orderId: order._id,
    });
  } catch (err) {
    console.error(
      "❌ Verify payment error:",
      err.message
    );

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};