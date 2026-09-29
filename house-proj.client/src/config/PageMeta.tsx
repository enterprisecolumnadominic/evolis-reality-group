import React from "react";
import { Helmet } from "react-helmet-async";
import { META_CONFIG, PageMetadata } from "../config/MetaConfig";

interface PageMetaProps {
  pageKey: keyof typeof META_CONFIG.pages;
  customTitle?: string;
  customDescription?: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  tags?: string[];
}

const PageMeta: React.FC<PageMetaProps> = ({
  pageKey,
  customTitle,
  customDescription,
  image,
  author,
  publishedTime,
  tags,
}) => {
  const pageData: PageMetadata = META_CONFIG.pages[pageKey];
  const brand = META_CONFIG.defaultTitle;

  if (!pageData) return null;

  const finalTitle = customTitle
    ? `${customTitle} | ${brand}`
    : `${pageData.title} | ${brand}`;
  const finalDesc = customDescription || pageData.description;

  return (
    <Helmet>
      {/* 1. Standard SEO */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {pageData.robots && <meta name="robots" content={pageData.robots} />}

      {/* 2. Open Graph / Facebook */}
      <meta
        property="og:type"
        content={publishedTime ? "article" : "website"}
      />
      <meta property="og:title" content={customTitle || pageData.title} />
      <meta property="og:description" content={finalDesc} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={window.location.href} />

      {/* 3. Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={customTitle || pageData.title} />
      <meta name="twitter:description" content={finalDesc} />
      {image && <meta name="twitter:image" content={image} />}

      {/* 4. Article Specific Metadata (Verified logic) */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {author && <meta property="article:author" content={author} />}
      {tags &&
        tags.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
    </Helmet>
  );
};

export default PageMeta;
