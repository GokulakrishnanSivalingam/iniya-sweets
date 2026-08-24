const { Resend } = require("resend");

async function sendOrderEmail(order) {
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.ADMIN_EMAIL ||
    !process.env.RESEND_FROM
  ) {
    throw new Error(
      "RESEND_API_KEY, ADMIN_EMAIL and RESEND_FROM are required"
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // ============================
  // OWNER / ADMIN EMAIL
  // ============================
  const adminEmail = resend.emails.send({
    from: process.env.RESEND_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🍬 NEW ORDER #${order._id} - Delivery Required`,
    html: `
      <h2>🍬 New Iniya Sugar Order</h2>

      <p><strong>Order ID:</strong> #${order._id}</p>

      <h3>Customer Details</h3>

      <p>
        <strong>Name:</strong> ${order.customer.fullName}<br>
        <strong>Phone:</strong> ${order.customer.mobile}<br>
        <strong>Email:</strong> ${order.customer.email}
      </p>

      <h3>🚚 DELIVERY ADDRESS</h3>

      <p>
        <strong>Address:</strong> ${order.customer.address}<br>
        <strong>City:</strong> ${order.customer.city}<br>
        <strong>State:</strong> ${order.customer.state}<br>
        <strong>Pincode:</strong> ${order.customer.pincode}
      </p>

      <h3>🛒 Products</h3>

      <ul>
        ${order.items
          .map(
            (item) => `
              <li>
                ${item.name} (${item.weight})
                × ${item.quantity}
                - Rs. ${item.price * item.quantity}
              </li>
            `
          )
          .join("")}
      </ul>

      <h3>💰 Payment</h3>

      <p>
        <strong>Subtotal:</strong> Rs. ${order.subtotal}<br>
        <strong>Delivery:</strong> ${
          order.delivery === 0
            ? "Free"
            : `Rs. ${order.delivery}`
        }<br>
        <strong>Total:</strong> Rs. ${order.total}<br>
        <strong>Payment Status:</strong> ${order.paymentStatus}
      </p>

      <hr>

      <h3>📦 ACTION REQUIRED</h3>

      <p>
        Please prepare this order and deliver it to the customer's
        address mentioned above.
      </p>

      <p>
        <strong>Iniya Sugar Admin</strong>
      </p>
    `,
  });

  // ============================
  // CUSTOMER EMAIL
  // ============================
  const customerEmail = resend.emails.send({
    from: process.env.RESEND_FROM,
    to: order.customer.email,
    subject: `🍬 Your Iniya Sugar Order #${order._id} is Confirmed`,
    html: `
      <h2>Thank you for your order, ${order.customer.fullName}! 🍬</h2>

      <p>
        Your order has been successfully placed and confirmed.
      </p>

      <p>
        <strong>Order ID:</strong> #${order._id}
      </p>

      <h3>Order Summary</h3>

      <ul>
        ${order.items
          .map(
            (item) => `
              <li>
                ${item.name} (${item.weight})
                × ${item.quantity}
                - Rs. ${item.price * item.quantity}
              </li>
            `
          )
          .join("")}
      </ul>

      <p>
        <strong>Subtotal:</strong> Rs. ${order.subtotal}<br>
        <strong>Delivery:</strong> ${
          order.delivery === 0
            ? "Free"
            : `Rs. ${order.delivery}`
        }<br>
        <strong>Total:</strong> Rs. ${order.total}
      </p>

      <h3>🚚 Delivery Address</h3>

      <p>
        ${order.customer.address}<br>
        ${order.customer.city}<br>
        ${order.customer.state} - ${order.customer.pincode}<br>
        Phone: ${order.customer.mobile}
      </p>

      <p>
        Your order will be prepared and arranged for delivery soon.
      </p>

      <p>
        Thank you for choosing <strong>Iniya Sugar</strong>!
      </p>
    `,
  });

  const results = await Promise.allSettled([
    adminEmail,
    customerEmail,
  ]);

  if (results[0].status === "fulfilled") {
    console.log("✅ OWNER EMAIL SENT");
  } else {
    console.error(
      "❌ OWNER EMAIL FAILED:",
      results[0].reason
    );
  }

  if (results[1].status === "fulfilled") {
    console.log("✅ CUSTOMER EMAIL SENT");
  } else {
    console.error(
      "❌ CUSTOMER EMAIL FAILED:",
      results[1].reason
    );
  }

  return results;
}

module.exports = {
  sendOrderEmail,
};