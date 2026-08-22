import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import Button from "../components/Button";

export default function Cart() {
  const { cartItems, subtotal, delivery, total } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Your Cart | Iniya Sugar";
  }, []);

  if (cartItems.length === 0) {
    return (
      <section className="section cart-empty">
        <div className="container">
          <FiShoppingBag size={64} className="cart-empty-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any sugar to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">
            Shop Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title-lg">Your Cart</h1>

        <div className="cart-layout">
          <div className="cart-list">
            <div className="cart-list-header">
              <span>Product</span>
              <span></span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <aside className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{delivery === 0 ? "Free Delivery" : `₹${delivery}`}</span>
            </div>
            {subtotal < 500 && (
              <p className="summary-note">
                Add items worth ₹{500 - subtotal} more for free delivery!
              </p>
            )}
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
