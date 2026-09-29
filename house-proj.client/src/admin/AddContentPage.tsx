import React from "react";
import "./AddContentPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContentForm } from "./hooks/useContentForm";
import PageMeta from "../config/PageMeta";

const AddContentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Connect to the Content Hook we built earlier
  const { formData, loading, handleInputChange, handleSave } =
    useContentForm(id);

  if (loading) {
    return <div className="acp-loading">Loading Content Data...</div>;
  }

  return (
    <div id="acp-container">
      <PageMeta pageKey="admin" />

      <div className="acp-card">
        <button className="acp-back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <header className="acp-header-text">
          <h1>{id ? "Edit Content" : "Create New Content"}</h1>
          <p>
            {id
              ? `Editing: ${formData.title}`
              : "Fill in the details to publish a new Blog or Event."}
          </p>
        </header>

        <form className="acp-form" onSubmit={handleSave}>
          {/* Section 1: Classification & Meta */}
          <div className="acp-section">
            <h3 className="acp-section-title">Classification & Meta</h3>
            <div className="acp-grid">
              <div className="acp-field">
                <label>Post Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                >
                  <option value="Blog">📝 Blog Post</option>
                  <option value="Event">📅 Event</option>
                </select>
              </div>
              <div className="acp-field">
                <label>Author</label>
                <input
                  required
                  type="text"
                  value={formData.author || ""}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                />
              </div>
              <div className="acp-field full-width">
                <label>Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., How to Buy Your First Home"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="acp-field full-width">
                <label>URL Slug (Required for SEO)</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., modern-home-trends-2026"
                  value={formData.slug || ""}
                  onChange={(e) => {
                    const sanitizedValue = e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-");
                    handleInputChange("slug", sanitizedValue);
                  }}
                />
                <small className="acp-help-text">
                  This will be the link:{" "}
                  <strong>
                    yoursite.com/content/{formData.slug || "your-slug"}
                  </strong>
                </small>
              </div>
            </div>
          </div>

          {/* Section 2: Content & Media */}
          <div className="acp-section">
            <h3 className="acp-section-title">Content & Media</h3>
            <div className="acp-grid">
              <div className="acp-field full-width acp-tagline-area">
                <label>Tagline / Short Intro</label>
                <textarea
                  required
                  value={formData.tagLine || ""}
                  onChange={(e) => handleInputChange("tagLine", e.target.value)}
                  placeholder="Write a catchy 1-2 sentence introduction here..."
                />
              </div>

              <div className="acp-field full-width">
                <label>Featured Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl || ""}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value)
                  }
                />
              </div>

              <div className="acp-field full-width acp-content-area">
                <label>Main Content (You can use full HTML markdown) </label>
                <textarea
                  required
                  value={formData.content || ""}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Start writing the main story here..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dates & Attributes */}
          <div className="acp-section">
            <h3 className="acp-section-title">Dates & Attributes</h3>
            <div className="acp-grid">
              <div className="acp-field">
                <label>Published Date</label>
                <input
                  type="date"
                  value={
                    formData.publishedDate
                      ? formData.publishedDate.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("publishedDate", e.target.value)
                  }
                />
              </div>

              {/* Conditional Event Date */}
              {formData.type === "Event" && (
                <div className="acp-field">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={
                      formData.eventDate ? formData.eventDate.split("T")[0] : ""
                    }
                    onChange={(e) =>
                      handleInputChange("eventDate", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="acp-field">
                <label>Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Real Estate, News, Guide"
                  value={
                    Array.isArray(formData.tags) ? formData.tags.join(", ") : ""
                  }
                  onChange={(e) => {
                    const array = e.target.value
                      .split(",")
                      .map((t) => t.trim());
                    handleInputChange("tags", array);
                  }}
                />
              </div>

              <div className="acp-field">
                <label>Featured Post?</label>
                <select
                  value={String(formData.isFeatured)}
                  onChange={(e) =>
                    handleInputChange("isFeatured", e.target.value === "true")
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes (Show on Homepage)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Visibility Status */}
          <div className="acp-section acp-status-zone">
            <div className="acp-status-card">
              <div className="acp-status-info">
                <h3>Post Visibility</h3>
                <p className="acp-help-text">
                  Set to Inactive if you want to save this as a draft.
                </p>
              </div>
              <div className="acp-field">
                <select
                  className={
                    formData.isActive ? "status-active" : "status-inactive"
                  }
                  value={String(formData.isActive)}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.value === "true")
                  }
                >
                  <option value="true">🟢 Published / Live</option>
                  <option value="false">🔴 Draft / Hidden</option>
                </select>
              </div>
            </div>
          </div>

          <div className="acp-footer">
            <button
              type="button"
              className="acp-discard"
              onClick={() => navigate("/dashboard")}
            >
              Discard
            </button>
            <button type="submit" className="acp-submit">
              {id ? "Update Content" : "Publish Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentPage;
