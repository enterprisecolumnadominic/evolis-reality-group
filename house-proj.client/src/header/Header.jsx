import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { BUSINESS_CONFIG } from "../config/BusinessConfig";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Useful for active link styling

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="nh-main-header nh-sticky-header">
      <div className="nh-header-content">
        {/* Left Side: Logo */}
        <div className="nh-header-left">
          <Link to="/" className="nh-logo-link">
            <span className="nh-logo-text">{BUSINESS_CONFIG.brandName}</span>
          </Link>
        </div>

        {/* Right Side: Navigation Links */}
        <nav className={`nh-header-links ${isOpen ? "nh-open" : ""}`}>
          <Link
            to="/"
            className={`nh-header-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/loans"
            className={`nh-header-link ${location.pathname === "/loans" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Loan
          </Link>

          <Link
            to="/properties"
            className={`nh-header-link ${location.pathname === "/properties" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Properties
          </Link>
          <Link
            to="/content"
            className={`nh-header-link ${location.pathname === "/content" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Content
          </Link>

          {/* 
          <Link
            to="/team"
            className={`nh-header-link ${location.pathname === "/team" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Our Team
          </Link>
          */}
          <Link
            to="/contact"
            className={`nh-header-link ${location.pathname === "/contact" ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className="nh-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>
      </div>
    </header>
  );
};

export default Header;
