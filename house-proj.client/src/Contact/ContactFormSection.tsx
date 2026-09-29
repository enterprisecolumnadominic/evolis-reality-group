import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faCertificate,
  faPaperPlane,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import ReCAPTCHA from "react-google-recaptcha";
import { BUSINESS_CONFIG } from "../config/BusinessConfig";
import { useInquiryModal } from "../modal/hooks/useInquiryModal";
import { useCountryCode } from "../modal/hooks/useCountryCode";
import "./ContactFormSection.css";

interface ContactFormSectionProps {
  agentEmail?: string;
  subject?: string;
}

const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  agentEmail = BUSINESS_CONFIG.contact.email,
  subject = "General Inquiry: Contact Page",
}) => {
  // 1. Load the country codes
  const { countries, isLoading: loadingCountries } = useCountryCode();

  // 2. Load the form logic
  const {
    formData,
    isSubmitting,
    isSuccess,
    errorType,
    errors,
    captchaToken,
    recaptchaRef,
    recaptchaSiteKey,
    handleChange,
    onCaptchaChange,
    handleSubmit,
  } = useInquiryModal(subject, () => {}, agentEmail);

  return (
    <section className="contact-form-section py-5" id="contact-form-anchor">
      <div className="contact-main-grid">
        {/* --- A. CONTACT FORM --- */}
        <div className="contact-form-block">
          {isSuccess ? (
            <div className="contact-success-state text-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="success-check mb-3"
              />
              <h2>Message Sent!</h2>
              <p>
                Thank you for reaching out. Our team will contact you shortly.
              </p>
            </div>
          ) : errorType === "rate-limit" ? (
            <div className="contact-error-state text-center">
              <div className="error-icon" style={{ fontSize: "3rem" }}>
                🛡️
              </div>
              <h2>Limit Reached</h2>
              <p>Too many requests detected. Please try again in an hour.</p>
            </div>
          ) : (
            <>
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group mb-3">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="text-danger small mt-1">
                      Please enter your name.
                    </div>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="text-danger small mt-1">
                      Valid email is required.
                    </div>
                  )}
                </div>
                {/* --- 🎯 PHONE INPUT WITH COUNTRY CODE SELECT --- */}
                <div className="mb-3">
                  <label className="form-label">Phone Number (Optional)</label>
                  <div className="input-group has-validation phone-input-group">
                    <select
                      className="form-select flex-grow-0 country-code-select"
                      style={{ width: "110px" }}
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      disabled={loadingCountries}
                    >
                      {loadingCountries && (
                        <option value="+63">PH (+63)</option>
                      )}

                      {!loadingCountries &&
                        countries.map((c, i) => (
                          <option key={i} value={c.code}>
                            {c.abbr} ({c.code})
                          </option>
                        ))}
                    </select>

                    <input
                      type="tel"
                      className="form-control phone-field"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* 🎯 Error message below the input group */}
                  {errors.phone && (
                    <div className="text-danger small mt-1">
                      Phone number is required.
                    </div>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="message">Your Inquiry</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="captcha-wrapper my-3">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={recaptchaSiteKey}
                    onChange={onCaptchaChange}
                  />
                </div>
                <button
                  type="submit"
                  className="submit-button btn btn-primary w-100"
                  disabled={!captchaToken || isSubmitting}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                  {isSubmitting ? " Sending..." : " Send Message"}
                </button>
                {errorType === "generic" && (
                  <p className="error-text mt-3 text-danger text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </>
          )}
        </div>

        {/* --- B. CONTACT DETAILS --- */}
        <div className="contact-details-block">
          <h2>Our Details</h2>
          <ul className="details-list list-unstyled mt-4">
            <li className="mb-4">
              <FontAwesomeIcon icon={faEnvelope} className="detail-icon me-3" />
              <span>{BUSINESS_CONFIG.contact.email}</span>
            </li>
            <li className="mb-4">
              <FontAwesomeIcon icon={faPhone} className="detail-icon me-3" />
              <span>{BUSINESS_CONFIG.contact.phone}</span>
            </li>
            <li className="mb-4">
              <FontAwesomeIcon
                icon={faCertificate}
                className="detail-icon me-3"
              />
              <span>{BUSINESS_CONFIG.license}</span>
            </li>
          </ul>

          <h3 className="mt-5">Connect With Us</h3>
          <div className="contact-socials d-flex gap-3 mt-3">
            <a
              href={BUSINESS_CONFIG.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon fb"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href={BUSINESS_CONFIG.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon tw"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              href={BUSINESS_CONFIG.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon li"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a
              href={BUSINESS_CONFIG.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon wa"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
