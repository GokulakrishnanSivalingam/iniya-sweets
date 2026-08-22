import { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import Button from "./Button";

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        <img src={product.image} alt={`${product.name} ${product.weightLabel}`} loading="lazy" />
      </div>
      <div className="product-card-body">
        <p className="product-card-tamil">{product.tamilName}</p>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-weight">{product.weightLabel}</p>
        <p className="product-card-price">₹{product.price}</p>

        <div className="product-card-controls">
          <div className="qty-selector" aria-label="Select quantity">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <FiMinus size={14} />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              <FiPlus size={14} />
            </button>
          </div>

          <Button variant="primary" onClick={handleAdd}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
