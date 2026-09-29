import React, { useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { BUSINESS_CONFIG } from "../config/BusinessConfig";
import PageMeta from "../config/PageMeta";

import { PropertyTable } from "./Dashboard/PropertyTable";
import { TeamTable } from "./Dashboard/TeamTable";
import { ContentTable } from "./Dashboard/ContentTable";
import { useAuth } from "./hooks/useAuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"properties" | "team" | "content">(
    "properties",
  );

  const {
    properties,
    propPage,
    setPropPage,
    propTotalPages,
    propTotalCount,
    team,
    teamPage,
    setTeamPage,
    teamTotalPages,
    teamTotalCount,
    content,
    contentPage,
    setContentPage,
    contentTotalPages,
    contentTotalCount,
    loading,
  } = useAdminDashboard(activeTab);

  const handleAddNew = () => {
    const routes = {
      properties: "/addProperty",
      team: "/addTeam",
      content: "/addContent",
    };
    navigate(routes[activeTab]);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };
  return (
    <div id="admin-dashboard-container">
      <PageMeta pageKey="adminDashboard" />

      <div className="admin-header">
        <h1>{BUSINESS_CONFIG.brandName} Management</h1>
        {/* The Logout Button */}
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "properties" ? "active" : ""}`}
          onClick={() => setActiveTab("properties")}
        >
          Properties ({propTotalCount})
        </button>
        <button
          className={`tab-btn ${activeTab === "team" ? "active" : ""}`}
          onClick={() => setActiveTab("team")}
        >
          Team ({teamTotalCount})
        </button>
        <button
          className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          Blog & Events ({contentTotalCount})
        </button>

        {/* The App Data Button */}
        <button className="admin-add-btn" onClick={handleAddNew}>
          {activeTab === "properties"
            ? "+ Add Property"
            : activeTab === "team"
              ? "+ Add Member"
              : "+ Create Post"}
        </button>
      </div>

      <div className="admin-table-wrapper">
        {loading ? (
          <div className="admin-loading-inline">
            <div className="spinner"></div>
            <p>Fetching {activeTab} data...</p>
          </div>
        ) : (
          <>
            {activeTab === "properties" && (
              <PropertyTable
                properties={properties}
                page={propPage}
                totalPages={propTotalPages}
                setPage={setPropPage}
              />
            )}
            {activeTab === "team" && (
              <TeamTable
                team={team}
                page={teamPage}
                totalPages={teamTotalPages}
                setPage={setTeamPage}
              />
            )}
            {activeTab === "content" && (
              <ContentTable
                content={content}
                page={contentPage}
                totalPages={contentTotalPages}
                setPage={setContentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
