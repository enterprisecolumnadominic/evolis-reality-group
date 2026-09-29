import React from "react";
import { useParams } from "react-router-dom";
import { usePropertyForm } from "./hooks/usePropertyForm";
import "./AddPropertyPage.css";
import PageMeta from "../config/PageMeta";

import { useTeamData } from "../../src/Team/hooks/useTeamData";

const AddPropertyPage = () => {
  // Use 'guid' from useParams, but 'usePropertyForm' handles the id logic
  const { id } = useParams<{ id: string }>();

  const { team: employees, loading: teamLoading } = useTeamData(true, 1);

  const {
    formData,
    loading,
    isSubmitting,
    handleInputChange,
    handleImageChange,
    handleSave,
    navigate,
  } = usePropertyForm(id);

  if (loading)
    return <div className="loading-screen">Loading Property Data...</div>;

  return (
    <div id="ap-container">
      <PageMeta pageKey="admin" />

      <div className="ap-form-card">
        <header className="ap-form-header">
          <button
            className="ap-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
          <h1>{id ? "Edit Property" : "New Property Entry"}</h1>
          <p className="ap-subtitle">
            Ensure all technical specifications match the physical deed.
          </p>
        </header>

        <form className="ap-main-form" onSubmit={handleSave}>
          {/* 1. Identity & Location */}
          <div className="ap-section">
            <h3 className="ap-section-title">Identity & Location</h3>
            <div className="ap-grid">
              <div className="ap-field-group">
                <label>Name (Street Address)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="ap-field-group">
                <label>Address (State/Province)</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Metro Manila"
                />
              </div>
              <div className="ap-field-group">
                <label>Price (PHP)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          {/* 2. Classification & Status */}
          <div className="ap-section">
            <h3 className="ap-section-title">Classification & Status</h3>
            <div className="ap-grid three-col">
              <div className="ap-field-group">
                <label>Listing Purpose</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) =>
                    handleInputChange("propertyType", Number(e.target.value))
                  }
                >
                  <option value={0}>For Sale</option>
                  <option value={1}>For Rent</option>
                  <option value={2}>Foreclosed</option>
                </select>
              </div>
              <div className="ap-field-group">
                <label>Property Category</label>
                <select
                  value={formData.subPropertyType}
                  onChange={(e) =>
                    handleInputChange("subPropertyType", Number(e.target.value))
                  }
                >
                  <option value={0}>Lot (Only)</option>
                  <option value={1}>House & Lot</option>
                  <option value={2}>Condominium</option>
                  <option value={3}>Commercial</option>
                </select>
              </div>
              <div className="ap-field-group">
                <label>Visibility Status</label>
                <select
                  value={String(formData.isEnabled)}
                  onChange={(e) =>
                    handleInputChange("isEnabled", e.target.value === "true")
                  }
                >
                  <option value="true">Visible on Website</option>
                  <option value="false">Hidden / Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Physical Specifications */}
          <div className="ap-section">
            <h3 className="ap-section-title">Physical Specifications</h3>
            <div className="ap-grid physical-specs-grid">
              <div className="ap-field-group">
                <label>Floor Space (sqm)</label>
                <input
                  type="number"
                  value={formData.floorSpace}
                  onChange={(e) =>
                    handleInputChange("floorSpace", Number(e.target.value))
                  }
                />
              </div>
              <div className="ap-field-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    handleInputChange("bedrooms", Number(e.target.value))
                  }
                />
              </div>
              <div className="ap-field-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    handleInputChange("bathrooms", Number(e.target.value))
                  }
                />
              </div>
              <div className="ap-field-group">
                <label>Built Year</label>
                <input
                  type="number"
                  value={formData.builtYear}
                  onChange={(e) =>
                    handleInputChange("builtYear", Number(e.target.value))
                  }
                />
              </div>
              <div className="ap-field-group">
                <label>Levels/Floors</label>
                <input
                  type="number"
                  value={formData.levels}
                  onChange={(e) =>
                    handleInputChange("levels", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          {/* 4. Map Coordinates */}
          <div className="ap-section">
            <h3 className="ap-section-title">GIS Coordinates</h3>
            <div className="ap-grid">
              <div className="ap-field-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) =>
                    handleInputChange("latitude", Number(e.target.value))
                  }
                />
              </div>
              <div className="ap-field-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) =>
                    handleInputChange("longitude", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>

          {/* 5. Multimedia */}
          <div className="ap-section">
            <h3 className="ap-section-title">Multimedia Assets</h3>
            <div className="ap-image-grid">
              {/* Indices 0-3 are standard image URLs */}
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="ap-field-group">
                  <label>Image URL {index + 1}</label>
                  <input
                    type="text"
                    value={formData.mediaItems[index]?.url || ""}
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="ap-field-group full-width-field">
              <label>Property Video Link (YouTube/Vimeo)</label>
              <input
                type="text"
                value={formData.mediaItems[4]?.videoDetails?.videoUrl || ""}
                placeholder="Paste YouTube link here..."
                onChange={(e) => handleImageChange(4, e.target.value)}
              />
            </div>
          </div>

          {/* 6. Narrative */}
          <div className="ap-section">
            <div className="ap-field-group">
              <label>Marketing Description</label>
              <textarea
                value={formData.description}
                rows={5}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Highlight the key features and amenities..."
              />
            </div>
          </div>

          {/* 7. Employee Assignment Section */}
          <div className="ap-section">
            <h3 className="ap-section-title">Assignment & Personnel</h3>
            <div className="ap-field-group">
              <label>Assigned Employee (Broker/Agent)</label>
              <select
                className="ap-employee-select"
                // 🎯 Check 1: Ensure this matches the interface key exactly (case-sensitive)
                value={formData.employeeProfileID || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  console.log("Selected ID from Dropdown:", selectedId); // Debug step A
                  handleInputChange("employeeProfileID", selectedId); // Debug step B
                }}
                required
              >
                <option value="">-- Select an Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              <p className="ap-input-hint">
                This link connects the property to the employee's contact
                details.
              </p>
            </div>
          </div>

          <footer className="ap-footer">
            <button
              type="button"
              className="ap-discard-btn"
              onClick={() => navigate("/dashboard")}
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="ap-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : id
                  ? "Update Property"
                  : "Save Property"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;
