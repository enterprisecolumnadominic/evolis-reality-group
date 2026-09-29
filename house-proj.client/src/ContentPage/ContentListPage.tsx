import React, { useState } from "react";
import { useContentData } from "./hooks/useContentData";
import ContentPostCard from "./ContentPostCard";
import { Pagination } from "../helpers/PaginationHelper";
import "./ContentListPage.css";
import PageMeta from "../config/PageMeta";

const ContentListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, loading, error, totalPages } = useContentData(
    undefined,
    currentPage,
  );

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <p>Fetching latest updates...</p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5 text-center text-danger">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="content-list-page-container container">
      <PageMeta pageKey="content" />

      <header className="list-header text-center">
        <h1 className="section-subtitle">Insights & Events</h1>
        <p className="section-title">
          Latest real estate trends and community events.
        </p>
      </header>

      <div className="content-list-wrapper">
        {posts.map((post) => (
          <ContentPostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No posts found.</p>
        </div>
      )}

      {/*Pagination Section */}
      {totalPages > 1 && (
        <div className="pagination-container d-flex justify-content-center mt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo(0, 0);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ContentListPage;
