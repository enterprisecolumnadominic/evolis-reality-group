import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ReCAPTCHA from "react-google-recaptcha";
import { useInquiryModal } from "./hooks/useInquiryModal";
import { useCountryCode } from "./hooks/useCountryCode";
import ModalBase from "./ModalBase";
import SuccessModal from "./SuccessModal";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  propertyAddress: string;
  agentEmail: string;
}

const InquiryModal: React.FC<InquiryModalProps> = (props) => {
  const { propertyName, propertyAddress, agentEmail, isOpen, onClose } = props;
  const { countries, isLoading: loadingCountries } = useCountryCode();

  const {
    formData,
    isSubmitting,
    captchaToken,
    recaptchaRef,
    recaptchaSiteKey,
    handleChange,
    onCaptchaChange,
    handleSubmit,
    isSuccess,
    errorType,
  } = useInquiryModal(propertyName, onClose, agentEmail);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      {isSuccess ? (
        <SuccessModal
          isOpen={isOpen}
          onClose={onClose}
          isEmbedded={true}
          title="Message Sent!"
          message={`Your details have been sent to our advisory team. We will contact you via email or the phone number provided shortly. Thank you for inquiring about ${propertyName}.`}
        />
      ) : errorType === "rate-limit" ? (
        <div className="modal-error-state text-center">
          <div className="error-icon" style={{ fontSize: "3rem" }}>
            🛡️
          </div>
          <h2>Limit Reached</h2>
          <p>
            Our Bot Shield detected too many requests. Try again in an hour.
          </p>
          <button onClick={onClose} className="btn btn-secondary mt-3">
            Understood
          </button>
        </div>
      ) : (
        <>
          <h2 className="mb-3">Inquire About Property</h2>
          <div className="property-context mb-4">
            <h3 className="h5">
              {propertyName}
              <small className="text-muted d-block">{propertyAddress}</small>
            </h3>
          </div>

          <form className="inquiry-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

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
                  {loadingCountries && <option value="+63">PH (+63)</option>}

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
            </div>

            <div className="mb-3">
              <label className="form-label">Your Message</label>
              <textarea
                className="form-control"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 d-flex justify-content-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={onCaptchaChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={!captchaToken || isSubmitting}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </>
      )}
    </ModalBase>
  );
};

export default InquiryModal;
