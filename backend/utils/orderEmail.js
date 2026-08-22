const { Resend } = require("resend");

function orderHtml(order) {
  const items = order.items
    .map((item) => `<li>${item.name} (${item.weight}) x ${item.quantity} - Rs. ${item.price * item.quantity}</li>`)
    .join("");
  return `<h2>Iniya Sugar order</h2><p><strong>Order:</strong> ${order._id}</p><p><strong>Customer:</strong> ${order.customer.fullName}<br>${order.customer.mobile}<br>${order.customer.email}<br>${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p><h3>Items</h3><ul>${items}</ul><p><strong>Total: Rs. ${order.total}</strong></p>`;
}

async function sendOrderEmail(order) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL || !process.env.RESEND_FROM) {
    throw new Error("RESEND_API_KEY, ADMIN_EMAIL, and RESEND_FROM are required");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: process.env.RESEND_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Iniya Sugar order ${order._id}`,
    html: orderHtml(order),
  });
}

module.exports = { sendOrderEmail };
