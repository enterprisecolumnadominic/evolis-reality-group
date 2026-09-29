import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllContent } from "../helpers/services/ContentService";
import { ContentPost_Data } from "../Data/ContentPost_Data";
import "./LatestInsights.css";

interface LatestInsightsProps {
  delay?: number;
}

const LatestInsights: React.FC<LatestInsightsProps> = ({ delay = 0 }) => {
  const [posts, setPosts] = useState<ContentPost_Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        // Fetch only 3 items, explicitly requesting Enabled content
        const data = await getAllContent(1, 3, true);

        // Access .items from the PagedResponse
        const list = data?.items || [];

        // Manual sort for "Latest"
        const sorted = [...list].sort(
          (a, b) =>
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime(),
        );

        setPosts(sorted);
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    };

    // 🎯 Set the delay timer
    const timer = setTimeout(() => {
      loadInsights();
    }, delay);

    // 🧹 Cleanup
    return () => clearTimeout(timer);
  }, [delay]);

  if (loading)
    return <div className="text-center py-5">Loading latest updates...</div>;
  if (posts.length === 0) return null;

  return (
    <section
      id="li-section-wrapper"
      className="li-main-container container-fluid py-5"
    >
      <div className="li-header text-center mb-5">
        <span className="li-section-tag">Latest Insights</span>
        <h2 className="li-section-subtitle">
          Expert advice and community updates
        </h2>
        <div className="li-title-underline"></div>
      </div>

      <div className="row g-4 px-lg-5">
        {posts.map((post) => (
          <div key={post.guid} className="col-12 col-md-6 col-lg-4">
            <div
              className="li-card-block"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url(${post.imageUrl})`,
              }}
            >
              <div className="li-card-content p-4">
                <span
                  className={`li-type-badge mb-3 badge ${post.type.toLowerCase()}`}
                >
                  {post.type}
                </span>

                <div className="li-text-content">
                  <h3 className="h4 fw-bold text-white">{post.title}</h3>
                  <p className="li-tagline text-white-50 mb-4">
                    {post.tagLine}
                  </p>

                  <Link to={`/content/${post.type}/${post.slug}`}>
                    <button className="btn btn-outline-light li-view-btn">
                      VIEW MORE
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="li-footer text-center mt-5">
        <Link
          to="/content"
          className="li-all-link fw-bold text-decoration-none"
        >
          Explore All Articles & Events →
        </Link>
      </div>
    </section>
  );
};

export default LatestInsights;
