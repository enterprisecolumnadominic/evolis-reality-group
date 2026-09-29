import React from "react";
import { Link } from "react-router-dom";
import "./HeroBanner.css";

const HERO_CONTENT = {
  // Use a verb to start the journey
  subtitle: "Expert Property Guidance",

  titleMain: "Home Loan Made Simple.",

  titleAccent: "The right home, on time, on budget.",

  buttonText: "START YOUR JOURNEY",
};
const HeroBanner = () => {
  return (
    <section
      id="hb-hero-wrapper"
      className="hb-hero-container d-flex align-items-center"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="hb-hero-content">
              {/* 1. The Strategy (Subtitle) */}
              <h2 className="hb-subtitle text-uppercase mb-2">
                {HERO_CONTENT.subtitle}
              </h2>

              {/* 2. The Solution (Main Title) */}
              <h1 className="hb-main-title display-1 fw-bold mb-4">
                <span className="hb-title-primary">
                  {HERO_CONTENT.titleMain}
                </span>
                <span className="hb-company-accent">
                  {HERO_CONTENT.titleAccent}
                </span>
              </h1>

              {/* 3. The Call to Action */}
              <div className="hb-action-area">
                <Link to="/properties">
                  <button className="btn btn-lg hb-explore-btn px-5 py-3">
                    {HERO_CONTENT.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
