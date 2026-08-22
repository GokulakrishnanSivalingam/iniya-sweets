import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={`${item.name} ${item.weightLabel}`} />
      </div>

      <div className="cart-item-info">
        <p className="cart-item-tamil">{item.tamilName}</p>
        <h4>{item.name}</h4>
        <p className="cart-item-weight">{item.weightLabel}</p>
      </div>

      <div className="cart-item-price">₹{item.price}</div>

      <div className="qty-selector">
        <button
          type="button"
          onClick={() => decreaseQuantity(item.id)}
          aria-label="Decrease quantity"
        >
          <FiMinus size={14} />
        </button>
        <span>{item.quantity}</span>
        <button
          type="button"
          onClick={() => increaseQuantity(item.id)}
          aria-label="Increase quantity"
        >
          <FiPlus size={14} />
        </button>
      </div>

      <div className="cart-item-total">₹{item.price * item.quantity}</div>

      <button
        className="cart-item-remove"
        onClick={() => removeFromCart(item.id)}
        aria-label="Remove item"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}
