const { Resend } = require("resend");

function orderHtml(order) {
  const items = order.items
    .map(
      (item) => `
        <li>
          <strong>${item.name}</strong> (${item.weight})
          × ${item.quantity}
          — Rs. ${item.price * item.quantity}
        </li>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">
      <h2>🍬 New Iniya Sugar Order</h2>

      <p>
        A new customer order has been placed successfully.
      </p>

      <hr>

      <h3>Order Details</h3>

      <p>
        <strong>Order ID:</strong> #${order._id}<br>
        <strong>Total:</strong> Rs. ${order.total}
      </p>

      <h3>Customer Details</h3>

      <p>
        <strong>Name:</strong> ${order.customer.fullName}<br>
        <strong>Mobile:</strong> ${order.customer.mobile}<br>
        <strong>Email:</strong> ${order.customer.email}
      </p>

      <h3>Delivery Address</h3>

      <p>
        ${order.customer.address}<br>
        ${order.customer.city}, ${order.customer.state}<br>
        PIN: ${order.customer.pincode}
      </p>

      <h3>Products Ordered</h3>

      <ul>
        ${items}
      </ul>

      <hr>

      <p>
        <strong>Subtotal:</strong> Rs. ${order.subtotal}<br>
        <strong>Delivery:</strong>
        ${order.delivery === 0 ? "Free" : `Rs. ${order.delivery}`}<br>
        <strong>Total:</strong> Rs. ${order.total}
      </p>

      <hr>

      <p>
        Please prepare the customer's order and arrange it for delivery.
      </p>

      <p>
        <strong>Iniya Sugar Admin</strong>
      </p>
    </div>
  `;
}

function customerOrderHtml(order) {
  const items = order.items
    .map(
      (item) => `
        <li>
          <strong>${item.name}</strong> (${item.weight})
          × ${item.quantity}
          — Rs. ${item.price * item.quantity}
        </li>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto;">
      
      <h2>🍬 Thank You for Your Order, ${
        order.customer.fullName
      }!</h2>

      <p>
        Your order has been <strong>successfully confirmed</strong>.
      </p>

      <p>
        <strong>Order ID:</strong> #${order._id}
      </p>

      <hr>

      <h3>Order Summary</h3>

      <ul>
        ${items}
      </ul>

      <p>
        <strong>Subtotal:</strong> Rs. ${order.subtotal}<br>
        <strong>Delivery:</strong>
        ${order.delivery === 0 ? "Free" : `Rs. ${order.delivery}`}<br>
        <strong>Total:</strong> Rs. ${order.total}
      </p>

      <hr>

      <h3>Delivery Address</h3>

      <p>
        ${order.customer.address}<br>
        ${order.customer.city}, ${order.customer.state}<br>
        PIN: ${order.customer.pincode}<br>
        Phone: ${order.customer.mobile}
      </p>

      <hr>

      <h3>📦 What's Next?</h3>

      <p>
        Your order has been received by Iniya Sugar.
        Our team will prepare your products and arrange them for delivery.
      </p>

      <p>
        We will keep you updated about your order.
      </p>

      <p>
        Thank you for choosing <strong>Iniya Sugar</strong>!
      </p>

      <p>
        🍬 Freshness you can trust.
      </p>

    </div>
  `;
}

async function sendOrderEmail(order) {
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.ADMIN_EMAIL ||
    !process.env.RESEND_FROM
  ) {
    throw new Error(
      "RESEND_API_KEY, ADMIN_EMAIL, and RESEND_FROM are required"
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Admin notification
  const adminEmail = resend.emails.send({
    from: process.env.RESEND_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🍬 New Iniya Sugar Order #${order._id}`,
    html: orderHtml(order),
  });

  // Customer confirmation
  const customerEmail = resend.emails.send({
    from: process.env.RESEND_FROM,
    to: order.customer.email,
    subject: `🍬 Your Iniya Sugar Order #${order._id} is Confirmed`,
    html: customerOrderHtml(order),
  });

  // Send both emails independently
  const results = await Promise.allSettled([
    adminEmail,
    customerEmail,
  ]);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const label = index === 0 ? "admin" : "customer";

      console.error(
        `Order email to ${label} failed:`,
        result.reason?.message || result.reason
      );
    }
  });

  return results;
}

module.exports = {
  sendOrderEmail,
};