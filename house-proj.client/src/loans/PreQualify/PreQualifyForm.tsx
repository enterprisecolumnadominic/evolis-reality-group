import React from "react";
import ReCAPTCHA from "react-google-recaptcha"; // 🎯 Import the component
import { usePreQualifyForm } from "./hooks/usePreQualifyForm";
import "./PreQualifyForm.css";
import { useCountryCode } from "../../modal/hooks/useCountryCode";
import SuccessModal from "../../modal/SuccessModal";

const PreQualifyForm: React.FC = () => {
  const {
    formData,
    errors,
    showSuccess,
    setShowSuccess,
    handleChange,
    handleSubmit,
    isSubmitting,
    captchaToken,
    onCaptchaChange,
    recaptchaRef,
    recaptchaSiteKey,
  } = usePreQualifyForm();

  const { countries, isLoading } = useCountryCode();

  const getInputClass = (fieldName: string) =>
    `form-control ${errors[fieldName as keyof typeof errors] ? "is-invalid" : ""}`;

  const getSelectClass = (fieldName: string) =>
    `form-select ${errors[fieldName as keyof typeof errors] ? "is-invalid" : ""}`;

  return (
    <div className="pq-form-wrapper py-5">
      <div className="container">
        <div className="pq-card mx-auto">
          <div className="text-center mb-5">
            <h2 className="pq-main-title">Pre-Qualification Form</h2>
            <p className="text-muted">
              Please provide the details below for our advisory team to review.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* --- SECTION 1: PROPERTY & LOAN --- */}
            <div className="pq-section mb-5">
              <h4 className="pq-section-header">01. Property Information</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Property Type</label>
                  <select
                    className={getSelectClass("propertyType")}
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                  >
                    <option value="">Select Type...</option>
                    <option value="House and Lot">House and Lot</option>
                    <option value="Condominium">Condominium</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                  {errors.propertyType && (
                    <div className="invalid-feedback">
                      {errors.propertyType}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Property Status</label>
                  <select
                    className={getSelectClass("propertyStatus")}
                    name="propertyStatus"
                    value={formData.propertyStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select Status...</option>
                    <option value="RFO">Ready for Occupancy</option>
                    <option value="Pre-selling">Pre-selling</option>
                    <option value="Foreclosed">Bank-Owned / Foreclosed</option>
                  </select>
                  {errors.propertyStatus && (
                    <div className="invalid-feedback">
                      {errors.propertyStatus}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Estimated Value</label>
                  <input
                    type="number"
                    className={getInputClass("propertyValue")}
                    name="propertyValue"
                    value={formData.propertyValue || ""}
                    onChange={handleChange}
                    placeholder="e.g. 5000000"
                  />
                  {errors.propertyValue && (
                    <div className="invalid-feedback">
                      {errors.propertyValue}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Desired Loan Tenure (1-25 Years)
                  </label>
                  <input
                    type="number"
                    className={getInputClass("loanTenure")}
                    name="loanTenure"
                    value={formData.loanTenure || ""}
                    onChange={handleChange}
                  />
                  {errors.loanTenure && (
                    <div className="invalid-feedback">{errors.loanTenure}</div>
                  )}
                </div>
              </div>
            </div>

            {/* --- SECTION 2: EMPLOYMENT --- */}
            <div className="pq-section mb-5">
              <h4 className="pq-section-header">02. Employment & Financial</h4>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Employment Type</label>
                  <select
                    className={getSelectClass("employmentType")}
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="Locally Employed">Locally Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="OFW">OFW</option>
                  </select>
                  {errors.employmentType && (
                    <div className="invalid-feedback">
                      {errors.employmentType}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Monthly Gross Income</label>
                  <input
                    type="number"
                    className={getInputClass("monthlyIncome")}
                    name="monthlyIncome"
                    value={formData.monthlyIncome || ""}
                    onChange={handleChange}
                  />
                  {errors.monthlyIncome && (
                    <div className="invalid-feedback">
                      {errors.monthlyIncome}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Years Employed</label>
                  <input
                    type="number"
                    className={getInputClass("yearsEmployed")}
                    name="yearsEmployed"
                    value={formData.yearsEmployed || ""}
                    onChange={handleChange}
                  />
                  {errors.yearsEmployed && (
                    <div className="invalid-feedback">
                      {errors.yearsEmployed}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- SECTION 3: PERSONAL --- */}
            <div className="pq-section mb-5">
              <h4 className="pq-section-header">03. Personal Information</h4>
              <div className="row g-4">
                {" "}
                {/* Increased gutter for better spacing */}
                {/* ROW 1: Names */}
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className={getInputClass("firstName")}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className={getInputClass("lastName")}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>
                {/* ROW 2: Date of Birth & Civil Status */}
                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className={getInputClass("dateOfBirth")}
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.dateOfBirth && (
                    <div className="invalid-feedback">{errors.dateOfBirth}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Civil Status</label>
                  <select
                    className={getSelectClass("civilStatus")}
                    name="civilStatus"
                    value={formData.civilStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Separated">Separated</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  {errors.civilStatus && (
                    <div className="invalid-feedback">{errors.civilStatus}</div>
                  )}
                </div>
                {/* ROW 3: Email & Phone */}
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className={getInputClass("email")}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <div className="input-group has-validation">
                    <select
                      className="form-select flex-grow-0"
                      style={{ width: "100px" }}
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      <option value="">Code</option>
                      {!isLoading &&
                        countries.map((c, i) => (
                          <option key={i} value={c.code}>
                            {c.abbr} ({c.code})
                          </option>
                        ))}
                    </select>
                    <input
                      type="tel"
                      className={getInputClass("phoneNumber")}
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <div className="invalid-feedback d-block">
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- CAPTCHA & SUBMIT SECTION --- */}

            <div className="d-flex flex-column align-items-center mb-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={onCaptchaChange}
              />

              <button
                type="submit"
                className={`pq-submit-wide-btn mt-4 ${!captchaToken || isSubmitting ? "btn-disabled" : ""}`}
                // 🎯 Disable if token is missing OR if the API call is in progress
                disabled={!captchaToken || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing...
                  </>
                ) : (
                  "Submit Pre-Qualification Request"
                )}
              </button>

              {/* Optional: Small hint for the user */}
              {!captchaToken && !isSubmitting && (
                <small className="text-muted mt-2">
                  Please verify the CAPTCHA to enable submission.
                </small>
              )}
            </div>
          </form>
        </div>

        <SuccessModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          title="Request Submitted!"
          message="Your pre-qualification details have been sent to our advisory team. We will contact you shortly. Thank you!"
        />
      </div>
    </div>
  );
};

export default PreQualifyForm;
