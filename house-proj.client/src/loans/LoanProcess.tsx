import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faCheckDouble,
  faCloudUploadAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./LoanProcess.css";

const LoanProcess: React.FC = () => {
  const steps = [
    {
      id: 1,
      icon: faFileAlt,
      title: "Request Your Consultation",
      desc: "Share your financial goals through our quick inquiry form to help us understand your dream home.",
    },
    {
      id: 2,
      icon: faCheckDouble,
      title: "Curated Financing Solutions",
      desc: "By hand-selecting the best rates for your budget and lifestyle, we offer you the financial clarity that comes with owning your dream home.",
    },
    {
      id: 3,
      icon: faCloudUploadAlt,
      title: "Secure Expert Processing",
      desc: "Receive a professional guided call to finalize details while submitting your files through our bank-grade secure platform.",
    },
    {
      id: 4,
      icon: faHome,
      title: "Final Approval & Turnover",
      desc: "Once verified, we finalize the paperwork so you can move into your dream home with total peace of mind with no additional cost.",
    },
  ];

  return (
    <section className="loan-process-section">
      <div className="container">
        <div className="process-header">
          <h1>How it Works</h1>
        </div>

        <div className="process-row">
          {/* This is the connecting line in the background */}
          <div className="process-line"></div>

          {steps.map((step) => (
            <div key={step.id} className={`process-step step-${step.id}`}>
              <div className="process-icon-wrapper">
                <div className="process-step-number">{step.id}</div>
                <div className="process-icon">
                  <FontAwesomeIcon icon={step.icon} />
                </div>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoanProcess;
