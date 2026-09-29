import React from "react";
import { Link } from "react-router-dom";
import "./LoanBanner.css";

const LOAN_CONTENT = {
  subtitle: "Certified Mortgage Advisory",
  titleMain: "Banking Relationships, Simplified.",
  titleAccent:
    "We bridge the gap between bank complexity and your home ownership goals.",
  buttonText: "PRE-QUALIFY NOW",
  trustBadge: "✓ Bank-Verified Listings • ✓ SEC-Registered • ✓ No Hidden Fees",
};

const LoanHeroBanner = () => {
  return (
    <section className="loan-hero-container">
      <div className="container">
        <div className="row">
          {/* We use col-lg-7 to keep the text on the left half */}
          <div className="col-lg-7 col-md-10">
            <div className="loan-hero-content">
              <h2 className="loan-subtitle">{LOAN_CONTENT.subtitle}</h2>

              <h1 className="loan-main-title">
                <span className="loan-title-primary">
                  {LOAN_CONTENT.titleMain}
                </span>
                <span className="loan-description">
                  {LOAN_CONTENT.titleAccent}
                </span>
              </h1>

              <div className="loan-action-area">
                <Link to="/pre-qualify">
                  <button className="btn btn-lg loan-btn">
                    {LOAN_CONTENT.buttonText}
                  </button>
                </Link>

                <div className="loan-trust-tagline">
                  {LOAN_CONTENT.trustBadge}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanHeroBanner;
