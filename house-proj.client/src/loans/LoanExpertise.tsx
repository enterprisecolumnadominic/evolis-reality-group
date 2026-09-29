import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltRight,
  faChartLine,
  faUserTie,
  faHandshake,
  IconDefinition, // 1. Import IconDefinition type for TypeScript
} from "@fortawesome/free-solid-svg-icons";
import "./LoanExpertise.css";
import { Link } from "react-router-dom";

// 2. Define the data structure interface for each expertise card
interface ExpertiseItem {
  id: number;
  number: string;
  icon: IconDefinition;
  title: string;
  description: string;
}

// 3. Centralized data array for easy editing and scalability
const expertiseData: ExpertiseItem[] = [
  {
    id: 1,
    number: "01",
    icon: faChartLine,
    title: "Market Expertise",
    description:
      "Benefit from our detailed market assessments and analysis, providing you with valuable insights.",
  },
  {
    id: 2,
    number: "02",
    icon: faUserTie,
    title: "Personalized Guidance",
    description:
      "Receive personalized investment strategies that align with your specific needs and financial objectives.",
  },
  {
    id: 3,
    number: "03",
    icon: faHandshake,
    title: "Professional Support",
    description:
      "Count on us for dedicated support throughout your journey to secure home ownership opportunities.",
  },
];

const LoanExpertise: React.FC = () => {
  return (
    <section className="loan-expertise-section container">
      <div className="loan-expertise-section-text">
        <h1>Why choose us</h1>

        <div className="expertise-grid">
          {expertiseData.map((item, index) => (
            <React.Fragment key={item.id}>
              {/* Dynamic Expertise Card */}
              <div className={`expertise-card card-${item.id}`}>
                <span className="expertise-number">{item.number}</span>
                <div className="expertise-icon-box">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              {/* Render arrow between cards (omitted after the last card) */}
              {index < expertiseData.length - 1 && (
                <div className={`expertise-arrow arrow-${item.id}`}>
                  <FontAwesomeIcon icon={faLongArrowAltRight} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="loan-action-area">
          <Link to="/pre-qualify">
            <button className="loan-prequal-btn">Pre-Qualify Now</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoanExpertise;
