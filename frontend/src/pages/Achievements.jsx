import { useEffect } from "react";
import { FiAward, FiCheckCircle, FiHeart, FiUsers } from "react-icons/fi";

const achievements = [
  { year: "01", icon: <FiAward />, title: "Consistent quality", text: "Every pack is selected and checked with the same care we give our own kitchens." },
  { year: "02", icon: <FiCheckCircle />, title: "Trusted preparation", text: "A clean, careful process from sugarcane selection to hygienic packing." },
  { year: "03", icon: <FiHeart />, title: "Made for families", text: "Simple sweetness for everyday tea, traditional recipes, and special moments." },
  { year: "04", icon: <FiUsers />, title: "Growing together", text: "Building a dependable local brand with customers at the centre of every decision." },
];

export default function Achievements() {
  useEffect(() => {
    document.title = "Our Achievements | Iniya Sugar";
  }, []);

  return (
    <section className="section achievements-page">
      <div className="container">
        <div className="achievements-hero">
          <div>
            <p className="section-eyebrow">எங்கள் சாதனைகள்</p>
            <h1 className="section-title-lg">Small steps. Sweet milestones.</h1>
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
        <div className="achievement-note"><p className="section-eyebrow">The promise</p><h2>Pure sweetness, handled with responsibility.</h2><p>We keep improving the way we source, check, pack, and serve so every order feels worthy of your home.</p></div>
      </div>
    </section>
  );
}
