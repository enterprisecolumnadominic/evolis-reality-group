// src/components/TokenPagination.tsx
import React from "react";
import "./TokenPagination.css"; // Keep your existing pagination styles

interface TokenPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export const TokenPagination: React.FC<TokenPaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  onNext,
  onPrev,
}) => {
  if (totalPages <= 1 && !hasNextPage) return null;

  return (
    <nav className="pagination-container-nav">
      <ul className="pagination-list shadow-sm">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-button"
            onClick={onPrev}
            disabled={currentPage === 1}
          >
            &laquo; Previous
          </button>
        </li>

        <li className="page-item active">
          <span className="page-button current-display">
            Page {currentPage} {totalPages > 0 ? `of ${totalPages}` : ""}
          </span>
        </li>

        <li className={`page-item ${!hasNextPage ? "disabled" : ""}`}>
          <button
            className="page-button"
            onClick={onNext}
            disabled={!hasNextPage}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};
