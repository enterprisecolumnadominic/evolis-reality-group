import React, { useState } from "react";
import "./PropertyContactSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import { Employee_Profile } from "../../../../Data/Employee_Profile";
import { BUSINESS_CONFIG } from "../../../../config/BusinessConfig";
import AgentProfileCard from "../../../../Team//AgentProfileCard";

interface PropertyContactSectionProps {
  latitude: number;
  longitude: number;
  onInquiryOpen: () => void;
  onMortgageOpen: () => void;
  onAgentOpen: () => void;
  // Passing these so the component remains dynamic
  shareUrl: string;
  shareTitle: string;
  isRent: Boolean;
  agent: Employee_Profile | null;
}

const PropertyContactSection: React.FC<PropertyContactSectionProps> = ({
  latitude,
  longitude,
  onInquiryOpen,
  onMortgageOpen,
  onAgentOpen,
  shareUrl,
  shareTitle,
  isRent,
  agent,
}) => {
  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
  };

  return (
    <div className="details-map-contact container clearfix">
      {/* --- MAP SECTION --- */}
      <div className="map-placeholder">
        <h2 className="section-heading">Location Map</h2>
        <div className="map-image-container">
          <iframe
            title="Location Map"
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
          ></iframe>
        </div>

        {/* 🎯 SOCIALS UNDER MAP: Aligned with map width */}
        <div className="map-social-footer">
          <span className="share-label">Share this property:</span>
          <div className="map-social-icons">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="map-icon fb"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="map-icon tw"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="map-icon li"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="map-icon wa"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </div>
      </div>

      {/* --- CONTACT & MORTGAGE SIDEBAR --- */}
      <div className="contact-mortgage-stack">
        <div className="contact-cta">
          <h2 className="section-heading">Contact Agent</h2>
          <div className="cta-box">
            <div className="agent-identity-stack">
              {/* 1. Round Image on Top */}
              <div className="agent-image-wrapper">
                {agent?.profilePhoto ? (
                  <img
                    src={agent.profilePhoto}
                    alt={agent.name}
                    className="agent-avatar-round"
                  />
                ) : (
                  <div className="agent-avatar-placeholder-round">
                    {agent?.name?.charAt(0) || "R"}
                  </div>
                )}
              </div>

              {/* 2. Text Stack Below */}
              <div className="agent-info-centered">
                <p className="agent-name">
                  {agent?.name || "Company Sales Team"}
                </p>

                {/* 3. Specialties Array as CSV String */}
                <p className="agent-specialties">
                  {Array.isArray(agent?.specialties)
                    ? agent.specialties.join(", ")
                    : "Property Consultant"}
                </p>
                <button
                  className="know-more-btn"
                  onClick={onAgentOpen}
                  style={{
                    color: "#007bff",
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Know more about {agent?.name?.split(" ")[0] || "us"}
                </button>
              </div>
            </div>

            <p className="cta-text">
              <strong>Book an appointment to request a tour.</strong>
            </p>

            <div className="cta-details">
              <p>
                <strong>Phone:</strong>
                <span className="business-detail">
                  {" "}
                  {agent?.phone || BUSINESS_CONFIG.contact.phone}
                </span>
              </p>
              <p>
                <strong>Email:</strong>
                <span className="business-detail">
                  {" "}
                  {agent?.email || BUSINESS_CONFIG.contact.email}
                </span>
              </p>
            </div>

            <button className="inquire-button" onClick={onInquiryOpen}>
              BOOK NOW
            </button>
          </div>
        </div>

        {/* 🎯 CONDITIONAL RENDER: Hide if isRent is true */}
        {!isRent && (
          <div className="mortgage-card">
            <h2 className="section-heading">Mortgage Calculator</h2>
            <div className="cta-box mortgage-box">
              <p className="cta-text">
                Estimate your monthly payments for this property.
              </p>
              <button
                className="inquire-button secondary"
                onClick={onMortgageOpen}
              >
                CALCULATE NOW
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyContactSection;
