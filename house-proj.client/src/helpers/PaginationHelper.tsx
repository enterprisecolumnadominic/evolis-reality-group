//src/helpers/PaginationHelper.ts

import React from "react";
import { getPaginationRange } from "./services/PaginationService";
import "./PaginationHelper.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = getPaginationRange(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Property navigation" className="pagination-container-nav">
      <ul className="pagination-list shadow-sm">
        {/* Previous */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-button"
            onClick={() => onPageChange(currentPage - 1)}
          >
            &laquo; Previous
          </button>
        </li>

        {/* Numbers */}
        {pages.map((page, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === page ? "active" : ""} ${page === "..." ? "dots-item disabled" : ""}`}
          >
            <button
              className="page-button"
              onClick={() => typeof page === "number" && onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Next */}
        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
        >
          <button
            className="page-button"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};
