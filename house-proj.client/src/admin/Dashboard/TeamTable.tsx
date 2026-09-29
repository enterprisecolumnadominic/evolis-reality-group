import React from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../helpers/PaginationHelper";

interface TeamTableProps {
  team: any[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const TeamTable: React.FC<TeamTableProps> = ({
  team,
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
            <th>Name</th>
            <th>Title</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {team.map((emp, index) => (
            <tr key={emp.id || `team-${index}`} className="admin-row">
              <td>
                <strong>{emp.name || "Unnamed"}</strong>
              </td>
              <td>{emp.title || "No Title"}</td>
              <td>{emp.email}</td>
              <td>
                <span
                  className={`status-badge ${emp.isActive ? "enabled" : "disabled"}`}
                >
                  {emp.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/addTeam/${emp.id}`)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
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
