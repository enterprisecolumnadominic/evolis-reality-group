import React from "react";
import { Link } from "react-router-dom";
import { ContentPost_Data } from "../Data/ContentPost_Data";
import "./ContentPostCard.css";

interface ContentPostCardProps {
  post: ContentPost_Data;
}

const ContentPostCard: React.FC<ContentPostCardProps> = ({ post }) => {
  return (
    <div className="content-post-card">
      <div className="content-card-layout">
        <Link
          to={`/content/${post.type}/${post.slug}`}
          className="content-card-image-container"
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className="content-card-image"
          />
          <span className={`content-type-badge ${post.type.toLowerCase()}`}>
            {post.type}
          </span>
        </Link>

        <div className="content-card-text">
          <div className="content-card-header">
            <Link
              to={`/content/${post.type}/${post.slug}`}
              className="content-card-title-link"
            >
              <h2>{post.title}</h2>
            </Link>
            <div className="content-meta-info">
              <span className="content-author">By {post.author}</span>
              <span className="content-divider">•</span>
              <span className="content-date">
                {new Date(post.publishedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <p className="content-card-tagline">{post.tagLine}</p>

          <div className="content-card-footer">
            <div className="content-card-tags">
              {post.tags?.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="mini-tag">
                  #{tag}
                </span>
              ))}
            </div>
            <Link
              to={`/content/${post.type}/${post.slug}`}
              className="read-more-link"
            >
              Read Article →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPostCard;
