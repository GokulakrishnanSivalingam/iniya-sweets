import { useState } from "react";
import {
  FiMinus,
  FiPlus,
  FiShoppingCart,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <article className="product-card">
      {/* Product Image */}
      <div className="product-card-image-wrap">
        {product.badge && (
          <span className="product-card-badge">
            {product.badge}
          </span>
        )}

        <img
          src={product.image}
          alt={`${product.name} ${product.weightLabel}`}
          loading="lazy"
        />

        {/* Quick Add */}
        <button
          type="button"
          className="product-card-quickadd"
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name} to cart`}
        >
          <FiShoppingCart size={15} />
          <span>Quick Add</span>
        </button>
      </div>

      {/* Product Details */}
      <div className="product-card-body">
        <p className="product-card-tamil">
          {product.tamilName}
        </p>

        <h3 className="product-card-name">
          {product.name}
        </h3>

        <p className="product-card-weight">
          {product.weightLabel}
        </p>

        {/* Price + Quantity */}
        <div className="product-card-controls">
          <p className="product-card-price">
            ₹{product.price}
          </p>

          <div
            className="qty-selector"
            aria-label="Select quantity"
          >
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
              aria-label="Decrease quantity"
            >
              <FiMinus size={13} />
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() =>
                setQuantity((q) => q + 1)
              }
              aria-label="Increase quantity"
            >
              <FiPlus size={13} />
            </button>
          </div>
        </div>

        {/* Add To Cart */}
        <button
          type="button"
          className="product-buttton"
          onClick={handleAdd}
        >
          <FiShoppingCart size={17} />
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
}