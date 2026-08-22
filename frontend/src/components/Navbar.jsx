import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/products", label: "Products" },
    { to: "/process", label: "Process" },
    { to: "/achievements", label: "Achievements" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <NavLink to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar-logo-tamil">இனியா</span>
          <span className="navbar-logo-en">INIYA SUGAR</span>
        </NavLink>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                "navbar-link" + (isActive ? " active" : "")
              }
              onClick={() => setMenuOpen(false)}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/cart"
            className="navbar-link navbar-cart-mobile"
            onClick={() => setMenuOpen(false)}
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <NavLink to="/cart" className="navbar-cart-icon" aria-label="View cart">
            <FiShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>

          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>
    </header>
  );
}
