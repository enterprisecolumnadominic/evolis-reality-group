import React from "react";
import { Link } from "react-router-dom";
import "./OurServices.css";

const OurServices = () => {
  return (
    <section id="os-component-wrapper" className="os-main-container py-5">
      <div className="container text-center mb-5">
        <span className="os-badge">Advisory Services</span>
        <h2 className="os-section-title">Real Estate Solutions</h2>
        <div className="os-title-underline"></div>
      </div>

      <div className="container">
        <div className="row g-4">
          {/* 1. Investment Assets */}
          <div className="col-12 col-md-4">
            <div className="os-service-card os-buy">
              <div className="os-card-overlay">
                <div className="os-content-box">
                  <h3 className="os-card-title">Property Assets</h3>
                  <p className="os-description">
                    Access premium property listings and institutional inventory
                    curated for long-term equity growth.
                  </p>
                  <Link to="/properties">
                    <button className="os-action-btn">View Properties</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Home Financing */}
          <div className="col-12 col-md-4">
            <div className="os-service-card os-loans">
              <div className="os-card-overlay">
                <div className="os-content-box">
                  <h3 className="os-card-title">Home Financing</h3>
                  <p className="os-description">
                    Certified mortgage advisory services to bridge the gap
                    between banking complexity and ownership.
                  </p>
                  <Link to="/loans">
                    <button className="os-action-btn">Explore Loans</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Strategic Marketing */}
          <div className="col-12 col-md-4">
            <div className="os-service-card os-marketing">
              <div className="os-card-overlay">
                <div className="os-content-box">
                  <h3 className="os-card-title">Listing Partnerships</h3>
                  <p className="os-description">
                    We provide banks, brokers, homeowners, and landlords a
                    digital presence to sell their assets with ease.
                  </p>
                  <Link to="/contact">
                    <button className="os-action-btn">Work With Us</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
