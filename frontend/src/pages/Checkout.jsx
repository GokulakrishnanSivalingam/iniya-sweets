import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import Button from "../components/Button";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const INDIAN_STATES = [
  "Tamil Nadu",
  "Andhra Pradesh",
  "Karnataka",
  "Kerala",
  "Puducherry",
  "Telangana",
  "Maharashtra",
  "Delhi",
  "West Bengal",
  "Other",
];

const initialForm = {
  fullName: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "Tamil Nadu",
  pincode: "",
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cartItems, subtotal, delivery, total, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | failed
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Checkout | Iniya Sugar";
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && status !== "success") {
      navigate("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      newErrors.email = "Enter a valid email address";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode.trim()))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayNow = async () => {
    if (!validate()) return;
    setStatus("loading");

    try {
      // 1. Ask backend to create a Razorpay order (amount calculated server-side is safer,
      // but we send the total for reference; backend should recompute from cart in production)
      const orderRes = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            weight: item.weightLabel,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");
      const orderData = await orderRes.json();

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Iniya Sugar",
        description: "Order Payment",
        order_id: orderData.orderId,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.mobile,
        },
        theme: { color: "#4D7C0F" },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              `${API_BASE_URL}/payment/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  customer: form,
                  items: cartItems,
                  subtotal,
                  delivery,
                  total,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setOrderId(verifyData.orderId || response.razorpay_order_id);
              setStatus("success");
              clearCart();
            } else {
              setStatus("failed");
            }
          } catch (err) {
            console.error(err);
            setStatus("failed");
          }
        },
        modal: {
          ondismiss: function () {
            setStatus("idle");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setStatus("failed");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setStatus("failed");
    }
  };

  if (status === "success") {
    return (
      <section className="section checkout-result">
        <div className="container">
          <FiCheckCircle size={64} className="result-icon success" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you, {form.fullName}. Your order has been confirmed.</p>
          {orderId && <p className="order-id">Order ID: {orderId}</p>}
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title-lg">Checkout</h1>

        {status === "failed" && (
          <div className="checkout-alert failed">
            <FiXCircle /> Payment failed or was cancelled. Please try again.
          </div>
        )}

        <div className="checkout-layout">
          <form
            className="checkout-form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <h3>Customer Information</h3>

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
              />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  id="mobile"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
                {errors.mobile && <span className="form-error">{errors.mobile}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House / Street / Area"
                rows={3}
              />
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Coimbatore"
                />
                {errors.city && <span className="form-error">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                >
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <span className="form-error">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  id="pincode"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
                {errors.pincode && <span className="form-error">{errors.pincode}</span>}
              </div>
            </div>
          </form>

          <aside className="cart-summary checkout-summary">
            <h3>Order Summary</h3>
            {cartItems.map((item) => (
              <div className="checkout-summary-item" key={item.id}>
                <span>
                  {item.name} ({item.weightLabel}) × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handlePayNow}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Processing..." : "Pay Now"}
            </Button>
            <p className="checkout-secure-note">
              Payments are securely processed via Razorpay.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
