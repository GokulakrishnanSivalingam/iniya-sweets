import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-pattern" aria-hidden="true"></div>
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo-tamil">இனியா சர்க்கரை</span>
          <span className="footer-logo-en">Iniya Sugar</span>
          <p className="footer-tagline">"Pure Sweetness, Straight from Nature"</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
          <Link to="/process">Process</Link>
          <Link to="/achievements">Achievements</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><FiMapPin /> Chennai, Tamil Nadu</p>
          <p><FiPhone /> +91 XXXXX XXXXX</p>
          <p><FiMail /> hello@iniyasugar.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Iniya Sugar. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
