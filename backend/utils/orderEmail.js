const { Resend } = require("resend");

function orderHtml(order) {
  const items = order.items
    .map((item) => `<li>${item.name} (${item.weight}) x ${item.quantity} - Rs. ${item.price * item.quantity}</li>`)
    .join("");
  return `<h2>Iniya Sugar order</h2><p><strong>Order:</strong> ${order._id}</p><p><strong>Customer:</strong> ${order.customer.fullName}<br>${order.customer.mobile}<br>${order.customer.email}<br>${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p><h3>Items</h3><ul>${items}</ul><p><strong>Total: Rs. ${order.total}</strong></p>`;
}

function customerOrderHtml(order) {
  const items = order.items
    .map((item) => `<li>${item.name} (${item.weight}) x ${item.quantity} - Rs. ${item.price * item.quantity}</li>`)
    .join("");
  return `
    <h2>Thank you for your order, ${order.customer.fullName}!</h2>
    <p>Your order <strong>#${order._id}</strong> has been confirmed.</p>
    <h3>Order Summary</h3>
    <ul>${items}</ul>
    <p>Subtotal: Rs. ${order.subtotal}<br>
    Delivery: ${order.delivery === 0 ? "Free" : `Rs. ${order.delivery}`}<br>
    <strong>Total: Rs. ${order.total}</strong></p>
    <h3>Delivery Address</h3>
    <p>${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}<br>
    Phone: ${order.customer.mobile}</p>
    <p>We'll get your order packed and shipped soon. Thank you for choosing Iniya Sugar!</p>
  `;
}

async function sendOrderEmail(order) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL || !process.env.RESEND_FROM) {
    throw new Error("RESEND_API_KEY, ADMIN_EMAIL, and RESEND_FROM are required");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Email to admin (order notification)
  const adminEmail = resend.emails.send({
    from: process.env.RESEND_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Iniya Sugar order ${order._id}`,
    html: orderHtml(order),
  });

  // Email to customer (order confirmation)
  const customerEmail = resend.emails.send({
    from: process.env.RESEND_FROM,
    to: order.customer.email,
    subject: `Your Iniya Sugar order #${order._id} is confirmed`,
    html: customerOrderHtml(order),
  });

  // Send both, but don't let one failure block the other
  const results = await Promise.allSettled([adminEmail, customerEmail]);
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const label = index === 0 ? "admin" : "customer";
      console.error(`Order email to ${label} failed:`, result.reason?.message || result.reason);
    }
  });

  return results;
}

module.exports = { sendOrderEmail };