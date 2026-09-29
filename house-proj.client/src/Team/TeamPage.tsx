import React, { useState } from "react";
import { useTeamData } from "./hooks/useTeamData";
import AgentProfileCard from "./AgentProfileCard";
import { Pagination } from "../helpers/PaginationHelper";
import "./TeamPage.css";
import PageMeta from "../config/PageMeta";

const TeamPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // 🎯 Standardized arguments: (isActive, page)
  const { team, loading, error, totalPages } = useTeamData(true, currentPage);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading our experts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center text-danger">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="team-page-container container">
      <PageMeta pageKey="team" />

      <header className="list-header text-center">
        <h1 className="section-subtitle">Meet Our Expert Team</h1>
        <p className="section-title">
          We are a Small Enterprise focused on specialized real estate
          expertise.
        </p>
      </header>

      <div className="agent-list-wrapper">
        {team.map((agent, index) => (
          <AgentProfileCard
            // 🎯 Use index combined with ID to guarantee uniqueness during testing
            key={`${agent.id || "emp"}-${index}`}
            agent={agent}
          />
        ))}
      </div>

      {team.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No team members are currently active.</p>
        </div>
      )}

      {/* 🎯 Standardized Pagination Section */}
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

export default TeamPage;
