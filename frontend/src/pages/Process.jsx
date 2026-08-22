import { useEffect } from "react";
import { GiSugarCane, GiScythe, GiFactory, GiMagnifyingGlass, GiCardboardBox } from "react-icons/gi";

const steps = [
  {
    icon: <GiSugarCane />,
    en: "Sugarcane Farming",
    ta: "கரும்பு விவசாயம்",
    desc: "Sugarcane is cultivated with care.",
  },
  {
    icon: <GiScythe />,
    en: "Harvesting",
    ta: "அறுவடை",
    desc: "Mature sugarcane is carefully harvested.",
  },
  {
    icon: <GiFactory />,
    en: "Processing",
    ta: "செயலாக்கம்",
    desc: "Sugarcane is processed under controlled conditions.",
  },
  {
    icon: <GiMagnifyingGlass />,
    en: "Quality Check",
    ta: "தர பரிசோதனை",
    desc: "The sugar goes through quality checks.",
  },
  {
    icon: <GiCardboardBox />,
    en: "Packing & Delivery",
    ta: "பேக்கிங் & டெலிவரி",
    desc: "The finished product is hygienically packed and delivered to customers.",
  },
];

export default function Process() {
  useEffect(() => {
    document.title = "Our Process | Iniya Sugar";
  }, []);

  return (
    <section className="section">
      <div className="container">
        <p className="section-eyebrow">எங்கள் செயல்முறை</p>
        <h1 className="section-title-lg">From Farm to Your Home</h1>
        <p className="section-subtitle">
          A simple, transparent journey — five steps from sugarcane field to
          your kitchen shelf.
        </p>

        <div className="timeline">
          {steps.map((step, index) => (
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
  );
}
