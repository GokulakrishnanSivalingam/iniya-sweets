import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiSugarCane, GiScythe, GiFactory, GiMagnifyingGlass, GiCardboardBox } from "react-icons/gi";
import { FiAward, FiCheckCircle, FiHeart, FiUsers, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { fetchCatalog } from "../data/catalog";
import ProductCard from "../components/ProductCard";

const FEATURED_COUNT = 4;

const LOADING_QUOTES = [
  "Sweetening every batch with care — Iniya Sugar.",
  "எங்கள் இனிமை, உங்கள் நம்பிக்கை — Iniya Sugar.",
  "From farm to kitchen, purity you can taste.",
];

const aboutValues = [
  "Sourced from trusted Tamil Nadu sugarcane farms",
  "Careful, quality-first sourcing process",
  "Hygienic, controlled processing",
  "Careful, tamper-proof packaging",
  "A genuine customer-first approach",
];

const processSteps = [
  { icon: <GiSugarCane />, en: "Sugarcane Farming", ta: "கரும்பு விவசாயம்", desc: "Sugarcane is cultivated with care." },
  { icon: <GiScythe />, en: "Harvesting", ta: "அறுவடை", desc: "Mature sugarcane is carefully harvested." },
  { icon: <GiFactory />, en: "Processing", ta: "செயலாக்கம்", desc: "Sugarcane is processed under controlled conditions." },
  { icon: <GiMagnifyingGlass />, en: "Quality Check", ta: "தர பரிசோதனை", desc: "The sugar goes through quality checks." },
  { icon: <GiCardboardBox />, en: "Packing & Delivery", ta: "பேக்கிங் & டெலிவரி", desc: "The finished product is hygienically packed and delivered to customers." },
];

const achievements = [
  { year: "01", icon: <FiAward />, title: "Consistent quality", text: "Every pack is selected and checked with the same care we give our own kitchens." },
  { year: "02", icon: <FiCheckCircle />, title: "Trusted preparation", text: "A clean, careful process from sugarcane selection to hygienic packing." },
  { year: "03", icon: <FiHeart />, title: "Made for families", text: "Simple sweetness for everyday tea, traditional recipes, and special moments." },
  { year: "04", icon: <FiUsers />, title: "Growing together", text: "Building a dependable local brand with customers at the centre of every decision." },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    document.title = "Iniya Sugar | Pure Quality Sugar from Tamil Nadu";
    setIsLoading(true);

    let cancelled = false;

    const tryFetch = () => {
      fetchCatalog()
        .then((items) => {
          if (cancelled) return;
          if (!items || items.length === 0) {
            // backend returned empty — keep retrying
            setTimeout(tryFetch, 3000);
            return;
          }
          setProducts(items);
          setIsLoading(false); // success — stop the loader
        })
        .catch(() => {
          if (cancelled) return;
          // backend not ready yet — wait a bit and try again
          setTimeout(tryFetch, 3000);
        });
    };

    tryFetch();

    return () => {
      cancelled = true; // stop retrying if component unmounts
    };
  }, []);

  // Rotate the loading quote every few seconds while products are loading
  useEffect(() => {
    if (!isLoading) return;
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [isLoading]);

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-media">
          <img
            src="https://imgs.search.brave.com/rEtxYeh4VAeqLQTqTIzqWgnl4rrK0JQEM0l9RcheLtQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tcGhv/dG8vc3VnYXJjYW5l/LXBsYW50ZWQtcHJv/ZHVjZS1zdWdhcl83/NTg3NDAtMTA3OS5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw/JnE9ODA"
            alt="Freshly harvested sugarcane and pure Iniya Sugar"
            className="hero-media-img"
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
          <div className="hero-scrim" aria-hidden="true"></div>
        </div>

        <div className="container hero-inner">
          <div className="hero-content">
            <p className="hero-eyebrow">
              <GiSugarCane /> Pure Sugar, From Tamil Nadu
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
              <a href="#about" className="btn btn-outline btn-on-image">
                About Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="products" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>

          {isLoading ? (
            <div className="products-loader" role="status" aria-live="polite">
              <div className="products-loader-spinner" aria-hidden="true" />
              <p className="products-loader-quote">{LOADING_QUOTES[quoteIndex]}</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.slice(0, FEATURED_COUNT).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="section-cta">
                <Link to="/products" className="btn btn-primary">
                  See More
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="container about-inner">
          <div className="about-text">
            <p className="section-eyebrow">எங்கள் கதை</p>
            <h2 className="section-title-lg">Our Story</h2>
            <p>
              Iniya Sugar was born from the rich agricultural traditions of Tamil
              Nadu, where sugarcane farming has been a way of life for generations.
              Our name, "Iniya" — meaning "sweet" in Tamil — reflects our promise
              to bring pure, honest sweetness into every Indian home.
            </p>
            <p>
              We work closely with sugarcane farms across Tamil Nadu, carefully
              selecting quality cane and processing it under controlled,
              hygienic conditions. Every batch is checked for purity before it is
              packed and delivered — because we believe a family's kitchen
              deserves nothing less.
            </p>
            <p>
              From our farms to your home, Iniya Sugar carries forward a
              tradition of trust, care, and natural sweetness — one spoon at a
              time.
            </p>

            <ul className="about-values">
              {aboutValues.map((value) => (
                <li key={value}>
                  <FiCheckCircle /> <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-image">
            <svg viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tamil Nadu sugarcane farmland">
              <rect width="400" height="460" fill="#F3E8CE" rx="16" />
              <rect x="0" y="300" width="400" height="160" fill="#E4CE9C" />
              <rect x="40" y="120" width="16" height="200" fill="#4D7C0F" />
              <rect x="80" y="90" width="16" height="230" fill="#5C8A22" />
              <rect x="120" y="130" width="16" height="190" fill="#4D7C0F" />
              <rect x="200" y="100" width="16" height="220" fill="#5C8A22" />
              <rect x="240" y="140" width="16" height="180" fill="#4D7C0F" />
              <rect x="290" y="90" width="16" height="230" fill="#5C8A22" />
              <rect x="330" y="130" width="16" height="190" fill="#4D7C0F" />
              <circle cx="330" cy="60" r="40" fill="#F5B942" opacity="0.8" />
            </svg>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="section">
        <div className="container">
          <p className="section-eyebrow">எங்கள் செயல்முறை</p>
          <h2 className="section-title-lg">From Farm to Your Home</h2>
          <p className="section-subtitle">
            A simple, transparent journey — five steps from sugarcane field to
            your kitchen shelf.
          </p>

          <div className="timeline">
            {processSteps.map((step, index) => (
              <div className="timeline-step" key={step.en}>
                <div className="timeline-marker">
                  <span className="timeline-icon">{step.icon}</span>
                  <span className="timeline-number">{index + 1}</span>
                </div>
                <div className="timeline-content">
                  <p className="timeline-tamil">{step.ta}</p>
                  <h3>{step.en}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" className="section section-alt achievements-page">
        <div className="container">
          <div className="achievements-hero">
            <div>
              <p className="section-eyebrow">எங்கள் சாதனைகள்</p>
              <h2 className="section-title-lg">Small steps. Sweet milestones.</h2>
              <p className="section-subtitle">Our achievements are measured in quality, trust, and the everyday kitchens we reach.</p>
            </div>
            <div className="achievements-score"><strong>100%</strong><span>care in every pack</span></div>
          </div>
          <div className="achievement-grid">
            {achievements.map((achievement) => (
              <article className="achievement-card" key={achievement.title}>
                <div className="achievement-card-top"><span>{achievement.year}</span><span className="achievement-icon">{achievement.icon}</span></div>
                <h2>{achievement.title}</h2>
                <p>{achievement.text}</p>
              </article>
            ))}
          </div>
          <div className="achievement-note">
            <p className="section-eyebrow">The promise</p>
            <h2>Pure sweetness, handled with responsibility.</h2>
            <p>We keep improving the way we source, check, pack, and serve so every order feels worthy of your home.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="container contact-inner">
          <div>
            <p className="section-eyebrow">We're Here to Help</p>
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
    </div>
  );
}