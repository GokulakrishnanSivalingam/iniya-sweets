const { Resend } = require("resend");

async function sendOrderEmail(order) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log("========== ORDER EMAIL ==========");
  console.log("Order ID:", order._id);
  console.log("OWNER EMAIL:", process.env.ADMIN_EMAIL);
  console.log("CUSTOMER EMAIL:", order.customer.email);
  console.log("CUSTOMER NAME:", order.customer.fullName);
  console.log("ADDRESS:", order.customer.address);
  console.log("CITY:", order.customer.city);
  console.log("STATE:", order.customer.state);
  console.log("PINCODE:", order.customer.pincode);
  console.log("=================================");

  // OWNER EMAIL
  try {
    const adminResult = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `🍬 NEW ORDER #${order._id} - DELIVERY REQUIRED`,
      html: `
        <h2>🍬 New Iniya Sugar Order</h2>

        <h3>Order Information</h3>
        <p>
          <strong>Order ID:</strong> #${order._id}<br>
          <strong>Payment:</strong> ${order.paymentStatus}<br>
          <strong>Total:</strong> Rs. ${order.total}
        </p>

        <hr>

        <h3>👤 Customer Information</h3>
        <p>
          <strong>Name:</strong> ${order.customer.fullName}<br>
          <strong>Phone:</strong> ${order.customer.mobile}<br>
          <strong>Email:</strong> ${order.customer.email}
        </p>

        <hr>

        <h3>🚚 DELIVERY ADDRESS</h3>

        <p>
          <strong>${order.customer.fullName}</strong><br>
          ${order.customer.address}<br>
          ${order.customer.city}<br>
          ${order.customer.state} - ${order.customer.pincode}<br>
          📞 ${order.customer.mobile}
        </p>

        <hr>

        <h3>🛒 ORDER ITEMS</h3>

        <ul>
          ${order.items
            .map(
              (item) => `
                <li>
                  ${item.name}
                  (${item.weight})
                  × ${item.quantity}
                  — Rs. ${item.price * item.quantity}
                </li>
              `
            )
            .join("")}
        </ul>

        <hr>

        <p>
          <strong>Subtotal:</strong> Rs. ${order.subtotal}<br>
          <strong>Delivery:</strong> ${
            order.delivery === 0
              ? "Free"
              : `Rs. ${order.delivery}`
          }<br>
          <strong>Total:</strong> Rs. ${order.total}
        </p>

        <hr>

        <h2>📦 ACTION REQUIRED</h2>

        <p>
          Please prepare this order and deliver it to the
          customer's address mentioned above.
        </p>

        <p>
          <strong>Iniya Sugar</strong>
        </p>
      `,
    });

    console.log("✅ OWNER EMAIL SENT");
    console.log("Owner Resend response:", adminResult);
  } catch (error) {
    console.error("❌ OWNER EMAIL FAILED");
    console.error(error);
  }

  // CUSTOMER EMAIL
  try {
    const customerResult = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: order.customer.email,
      subject: `🍬 Your Iniya Sugar Order #${order._id} is Confirmed`,
      html: `
        <h2>Thank You, ${order.customer.fullName}! 🍬</h2>

        <p>
          Your order has been successfully confirmed.
        </p>

        <p>
          <strong>Order ID:</strong> #${order._id}
        </p>

        <hr>

        <h3>🛒 Your Order</h3>

        <ul>
          ${order.items
            .map(
              (item) => `
                <li>
                  ${item.name}
                  (${item.weight})
                  × ${item.quantity}
                  — Rs. ${item.price * item.quantity}
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

        <hr>

        <h3>🚚 Your Delivery Address</h3>

        <p>
          ${order.customer.fullName}<br>
          ${order.customer.address}<br>
          ${order.customer.city}<br>
          ${order.customer.state} - ${order.customer.pincode}<br>
          📞 ${order.customer.mobile}
        </p>

        <hr>

        <p>
          Your order has been received successfully.
          We will prepare your products and arrange delivery
          to the address provided above.
        </p>

        <p>
          Thank you for choosing <strong>Iniya Sugar</strong>! 🍬
        </p>
      `,
    });

    console.log("✅ CUSTOMER EMAIL SENT");
    console.log("Customer Resend response:", customerResult);
  } catch (error) {
    console.error("❌ CUSTOMER EMAIL FAILED");
    console.error(error);
  }
}

module.exports = {
  sendOrderEmail,
};