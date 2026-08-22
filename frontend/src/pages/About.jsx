import { useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";

const values = [
  "Sourced from trusted Tamil Nadu sugarcane farms",
  "Careful, quality-first sourcing process",
  "Hygienic, controlled processing",
  "Careful, tamper-proof packaging",
  "A genuine customer-first approach",
];

export default function About() {
  useEffect(() => {
    document.title = "About Us | Iniya Sugar";
  }, []);

  return (
    <section className="section about-page">
      <div className="container about-inner">
        <div className="about-text">
          <p className="section-eyebrow">எங்கள் கதை</p>
          <h1 className="section-title-lg">Our Story</h1>
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
            {values.map((value) => (
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
  );
}
