import React from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../helpers/PaginationHelper";

interface ContentTableProps {
  content: any[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const ContentTable: React.FC<ContentTableProps> = ({
  content,
  page,
  totalPages,
  setPage,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Author</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {content.map((post, index) => {
            const itemIdentifier = post.guid || post.id;
            return (
              <tr
                key={itemIdentifier || `content-${index}`}
                className="admin-row"
              >
                <td>
                  <strong>{post.title}</strong>
                </td>
                <td>
                  <span
                    className={`type-tag ${post.type === "Event" ? "type-event" : "type-blog"}`}
                  >
                    {post.type}
                  </span>
                </td>
                <td>{post.author}</td>
                <td>{post.publishedDate?.split("T")[0]}</td>
                <td>
                  <span
                    className={`status-badge ${post.isActive ? "enabled" : "disabled"}`}
                  >
                    {post.isActive ? "Published" : "Draft"}
                  </span>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/addContent/${itemIdentifier}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="admin-pagination-footer">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        <p className="page-info">
          Page {page} of {totalPages}
        </p>
      </div>
    </>
  );
};
