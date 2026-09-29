import React from "react";
import "./AddTeamPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamForm } from "./hooks/useTeamForm";
import PageMeta from "../config/PageMeta";

const AddTeamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    formData,
    loading,
    isRealId,
    isSubmitting,
    handleInputChange,
    handleSocialChange,
    handleCSVChange,
    handleSave,
  } = useTeamForm(id);

  if (loading) {
    return <div className="atp-loading">Loading Member Data...</div>;
  }

  return (
    <div id="atp-container">
      <PageMeta pageKey="admin" />

      <div className="atp-card">
        <button className="atp-back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <header className="atp-header-text">
          <h1>{isRealId ? "Edit Member" : "Add New Team Member"}</h1>
          <p>
            {isRealId
              ? `Update the professional profile for ${formData.name || "this member"}.`
              : "Create a new profile for a new employee."}
          </p>
        </header>

        <form className="atp-form" onSubmit={handleSave}>
          {/* Section 1: Identity & Contact */}
          <div className="atp-section">
            <h3 className="atp-section-title">Identity & Contact</h3>
            <div className="atp-grid">
              <div className="atp-field">
                <label>Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="atp-field">
                <label>Job Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="atp-field">
                <label>Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="atp-field">
                <label>Phone Number</label>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Presentation Photos */}
          <div className="atp-section">
            <h3 className="atp-section-title">Presentation Photos</h3>
            <div className="atp-grid">
              <div className="atp-field">
                <label>Profile Photo URL</label>
                <input
                  type="text"
                  value={formData.profilePhoto}
                  onChange={(e) =>
                    handleInputChange("profilePhoto", e.target.value)
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Professional Details */}
          <div className="atp-section">
            <h3 className="atp-section-title">Specializations & Bio</h3>
            <div className="atp-grid">
              <div className="atp-field">
                <label>Specialties (Separate with commas)</label>
                <input
                  type="text"
                  value={
                    Array.isArray(formData.specialties)
                      ? formData.specialties.join(", ")
                      : formData.specialties || ""
                  }
                  onChange={(e) =>
                    handleCSVChange("specialties", e.target.value)
                  }
                  placeholder="Luxury, Commercial, Rentals"
                />
              </div>

              <div className="atp-field">
                <label>Languages (Separate with commas)</label>
                <input
                  type="text"
                  value={
                    Array.isArray(formData.languages)
                      ? formData.languages.join(", ")
                      : formData.languages || ""
                  }
                  onChange={(e) => handleCSVChange("languages", e.target.value)}
                  placeholder="English, Tagalog"
                />
              </div>

              <div className="atp-field full-width atp-bio">
                <label>Professional Description</label>
                <textarea
                  required
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Tell us about your professional background..."
                />
              </div>
            </div>
          </div>

          {/* Section 4: Social Media */}
          <div className="atp-section">
            <h3 className="atp-section-title">Social Media</h3>
            <div className="atp-grid">
              {["linkedin", "facebook", "instagram", "twitter", "youtube"].map(
                (platform) => (
                  <div className="atp-field" key={platform}>
                    <label className="capitalize">{platform}</label>
                    <input
                      type="text"
                      value={
                        formData.socials?.[
                          platform as keyof typeof formData.socials
                        ] || ""
                      }
                      onChange={(e) =>
                        handleSocialChange(platform as any, e.target.value)
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Section 5: Account Visibility */}
          <div className="atp-section atp-status-zone">
            <div className="atp-status-card">
              <div className="atp-status-info">
                <h3
                  className="atp-section-title"
                  style={{ marginTop: 0, border: "none" }}
                >
                  Profile Visibility
                </h3>
                <p className="atp-help-text">
                  Decide if this profile should be published to the live team
                  page.
                </p>
              </div>

              <div className="atp-field" style={{ minWidth: "200px" }}>
                <select
                  className={
                    formData.isActive ? "status-active" : "status-inactive"
                  }
                  value={String(formData.isActive)}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.value === "true")
                  }
                >
                  <option value="true">🟢 Active / Published</option>
                  <option value="false">🔴 Inactive / Hidden</option>
                </select>
              </div>
            </div>
          </div>

          <div className="atp-footer">
            <button
              type="button"
              className="atp-discard"
              disabled={isSubmitting}
              onClick={() => navigate("/dashboard")}
            >
              Discard
            </button>

            <button
              type="submit"
              className="atp-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isRealId
                  ? "Update Profile"
                  : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamPage;
