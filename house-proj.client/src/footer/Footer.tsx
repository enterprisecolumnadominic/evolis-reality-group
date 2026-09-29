import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faTelegramPlane,
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

// 🚀 Import your Single Source of Truth
import { BUSINESS_CONFIG } from "../config/BusinessConfig";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-grid">
        {/* --- 1. Business Contact Information --- */}
        <div className="footer-column contact-info">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <FontAwesomeIcon icon={faEnvelope} />
              <a
                href={`mailto:${BUSINESS_CONFIG.contact.email}?subject=Website%20Inquiry`}
              >
                {BUSINESS_CONFIG.contact.email}
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faPhone} />
              <a href={`tel:${BUSINESS_CONFIG.contact.phone}`}>
                {BUSINESS_CONFIG.contact.phone}
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              {BUSINESS_CONFIG.contact.address}
            </li>
            <li>
              <FontAwesomeIcon icon={faCertificate} />
              {BUSINESS_CONFIG.license}
            </li>
          </ul>
        </div>

        {/* --- 2. Quick Links --- */}
        <div className="footer-column quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/properties">Properties</Link>
            </li>
            <li>
              <Link to="/loans">Loan</Link>
            </li>
            <li>
              <Link to="/content">Content</Link>
            </li>
            {/*
            <li>
              <Link to="/team">Our Team</Link>
            </li>
            */}
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>

        {/* --- 3. Social and Messaging --- */}
        <div className="footer-column social-links">
          <h3>Connect</h3>
          <div className="social-icons">
            <a
              href={BUSINESS_CONFIG.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                className="social-icon whatsapp"
              />
            </a>
            <a
              href={BUSINESS_CONFIG.socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faTelegramPlane}
                className="social-icon telegram"
              />
            </a>
            <a
              href={BUSINESS_CONFIG.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebook} className="social-icon" />
            </a>
            <a
              href={BUSINESS_CONFIG.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faTwitter} className="social-icon" />
            </a>
            <a
              href={BUSINESS_CONFIG.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      {/* --- 4. Copyright --- */}
      <div className="footer-copyright">
        © {new Date().getFullYear()} {BUSINESS_CONFIG.brandName}. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
