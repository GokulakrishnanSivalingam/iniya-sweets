const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { createAdminToken, isValidPassword, isValidUsername, requireAdmin } = require("../middleware/adminAuth");
const { sendOrderEmail } = require("../utils/orderEmail");

router.post("/login", (req, res) => {
  if (!isValidUsername(req.body.username) || !isValidPassword(req.body.password)) {
    return res.status(401).json({ message: "Incorrect username or password" });
  }
  res.json({ token: createAdminToken() });
});

router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    console.error("List orders error:", error.message);
    res.status(500).json({ message: "Unable to load orders" });
  }
});

router.post("/orders/:id/resend-email", requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    await sendOrderEmail(order);
    res.json({ message: "Order email sent to admin" });
  } catch (error) {
    console.error("Resend order email error:", error.message);
    res.status(500).json({ message: "Unable to send email. Check SMTP settings." });
  }
});

module.exports = router;
