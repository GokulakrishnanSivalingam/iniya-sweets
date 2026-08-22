import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiSugarCane } from "react-icons/gi";
import { FiAward, FiCheckCircle, FiDroplet, FiHeart, FiHome, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { fetchCatalog } from "../data/catalog";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = "Iniya Sugar | Pure Quality Sugar from Tamil Nadu";
    fetchCatalog().then(setProducts).catch(() => {});
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-pattern" aria-hidden="true"></div>
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="hero-eyebrow">
              <GiSugarCane /> தமிழ்நாட்டின் தூய சர்க்கரை
            </p>
            <h1 className="hero-tamil">ஒவ்வொரு தேநீரிலும் இனிமை</h1>
            <p className="hero-english">Sweetness in Every Spoon</p>
            <p className="hero-desc">
              Pure and quality sugar made for every Indian kitchen.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                Shop Now
              </Link>
              <Link to="/about" className="btn btn-outline">
                எங்களை பற்றி
              </Link>
            </div>
          </div>

          <div className="hero-image" role="img" aria-label="Sugarcane farm illustration">
            <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="190" fill="#E7EFD8" />
              <rect x="60" y="180" width="14" height="160" fill="#4D7C0F" />
              <rect x="100" y="150" width="14" height="190" fill="#5C8A22" />
              <rect x="140" y="170" width="14" height="170" fill="#4D7C0F" />
              <rect x="250" y="160" width="14" height="180" fill="#5C8A22" />
              <rect x="290" y="185" width="14" height="155" fill="#4D7C0F" />
              <rect x="330" y="150" width="14" height="190" fill="#5C8A22" />
              <path d="M60 180 Q 67 150 90 155" stroke="#3F6412" strokeWidth="6" fill="none" />
              <path d="M114 150 Q 121 120 145 128" stroke="#3F6412" strokeWidth="6" fill="none" />
              <path d="M330 150 Q 337 120 360 128" stroke="#3F6412" strokeWidth="6" fill="none" />
              <ellipse cx="200" cy="345" rx="150" ry="18" fill="#B7D2BD" />
              <circle cx="200" cy="260" r="55" fill="#E36B45" opacity="0.15" />
              <text x="200" y="270" fontFamily="Georgia, serif" fontSize="20" textAnchor="middle" fill="#173B3F">இனியா</text>
            </svg>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Iniya Sugar</h2>
          <div className="why-grid">
            <div className="why-card">
              <FiCheckCircle className="why-icon" />
              <h3>100% Quality</h3>
              <p>Carefully selected sugar for consistent quality.</p>
            </div>
            <div className="why-card">
              <FiDroplet className="why-icon" />
              <h3>Pure & Fresh</h3>
              <p>Cleanly processed and packed.</p>
            </div>
            <div className="why-card">
              <FiHeart className="why-icon" />
              <h3>Trusted Taste</h3>
              <p>Made for Indian families and traditional recipes.</p>
            </div>
            <div className="why-card">
              <FiHome className="why-icon" />
              <h3>Farm to Home</h3>
              <p>Quality sugar brought closer to your kitchen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="section-cta">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="section home-process">
        <div className="container">
          <div className="home-section-heading">
            <div>
              <p className="section-eyebrow">எங்கள் செயல்முறை</p>
              <h2 className="section-title">From Farm to Home</h2>
            </div>
            <Link to="/process" className="text-link">See our process →</Link>
          </div>
          <div className="process-strip">
            <div className="process-item"><span>01</span><h3>Farm</h3><p>Carefully grown sugarcane.</p></div>
            <div className="process-item"><span>02</span><h3>Process</h3><p>Clean, controlled production.</p></div>
            <div className="process-item"><span>03</span><h3>Check</h3><p>Quality checked every time.</p></div>
            <div className="process-item"><span>04</span><h3>Deliver</h3><p>Packed fresh for your home.</p></div>
          </div>
        </div>
      </section>

      <section className="section achievements-preview">
        <div className="container">
          <div className="home-section-heading">
            <div>
              <p className="section-eyebrow">எங்கள் சாதனைகள்</p>
              <h2 className="section-title">What we stand for</h2>
            </div>
            <Link to="/achievements" className="text-link">Our achievements →</Link>
          </div>
          <div className="achievement-preview-grid">
            <div><FiAward /><strong>Quality first</strong><span>Care in every pack</span></div>
            <div><FiCheckCircle /><strong>Trusted process</strong><span>Checked from farm to home</span></div>
            <div><FiHeart /><strong>Made for families</strong><span>Sweetness for everyday life</span></div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container contact-inner">
          <div>
            <p className="section-eyebrow">நாங்கள் உதவ இங்கே இருக்கிறோம்</p>
            <h2>Need help with your order?</h2>
            <p>Reach us for product questions, bulk orders, or delivery support.</p>
          </div>
          <div className="contact-actions">
            <a href="tel:+91XXXXXXXXXX" className="contact-action"><FiPhone /><span>Call us<strong>+91 XXXXX XXXXX</strong></span></a>
            <a href="mailto:hello@iniyasugar.com" className="contact-action"><FiMail /><span>Email us<strong>hello@iniyasugar.com</strong></span></a>
            <span className="contact-action"><FiMapPin /><span>Visit us<strong>Chennai, Tamil Nadu</strong></span></span>
          </div>
        </div>
      </section>

      {/* TAMIL QUOTE */}
      <section className="quote-section">
        <div className="container">
          <p className="quote-tamil">
            "இனிப்பு என்பது சுவை மட்டுமல்ல,<br />அது ஒரு நினைவு."
          </p>
          <p className="quote-english">
            "Sweetness is not just a taste, it is a memory."
          </p>
        </div>
      </section>
    </>
  );
}
