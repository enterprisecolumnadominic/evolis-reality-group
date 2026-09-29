import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getContentBySlug } from "../helpers/services/ContentService";
import { ContentPost_Data } from "../Data/ContentPost_Data";
import "./ContentDetailPage.css";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import PageMeta from "../config/PageMeta";

const ContentDetailPage = () => {
  const { type, slug } = useParams<{ type: string; slug: string }>();
  const [post, setPost] = useState<ContentPost_Data | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post?.title || "Check out this post!");

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
  };

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        if (type && slug) {
          const data = await getContentBySlug(type, slug);
          setPost(data);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [type, slug]);

  if (loading) return <div className="content-loader">Loading Story...</div>;
  if (!post)
    return <div className="content-error">We couldn't find that post.</div>;

  return (
    <div id="content-detail-root">
      {/* 🎯 SEO DYNAMIC TAGS */}
      <PageMeta
        pageKey="content"
        customTitle={`${post.title} | ${post.type}`}
        customDescription={
          post.tagLine || `Read our latest ${post.type.toLowerCase()}...`
        }
        image={post.imageUrl}
        author={post.author}
        publishedTime={post.publishedDate}
        tags={post.tags}
      />

      <header className="content-header">
        <div className="meta-top">
          <button className="back-button" onClick={() => navigate("/content")}>
            <FontAwesomeIcon icon={faChevronLeft} /> Back to Content
          </button>

          <span className={`type-pill ${post.type.toLowerCase()}`}>
            {post.type}
          </span>
        </div>
        <h1>{post.title}</h1>

        <div className="author-line">
          <span className="by">By</span> <strong>{post.author}</strong>
          <span className="bullet-separator">•</span>
          <span className="publish-date">
            {new Date(post.publishedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </header>

      {post.type === "Event" && post.eventDate && (
        <div className="event-info-banner">
          <div>
            <strong>
              Coming this{" "}
              {new Date(post.publishedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </div>
        </div>
      )}

      <article className="content-tagLine">
        {/* The TagLine (Lead Paragraph) */}
        {post.tagLine && (
          <div className="content-tagline">
            <strong>{post.tagLine}</strong>
          </div>
        )}
      </article>

      {/* Main Image */}
      <div className="content-featured-image">
        <img src={post.imageUrl} alt={post.title} className="main-image" />
      </div>

      {/* Content Body */}
      <main className="content-container">
        <article className="content-body">
          <div
            className="content-rich-text"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Standardized Tag Section */}
          <div className="content-footer">
            <div className="tag-list">
              {post.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="tag-badge">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/*Socials Section*/}
          <div className="content-social-icons">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title="Share on Facebook"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>

            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title="Share on Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>

            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title="Share on LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>

            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn wa"
              title="Share on WhatsApp"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ContentDetailPage;
