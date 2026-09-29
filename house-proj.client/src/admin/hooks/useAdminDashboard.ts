//src/hooks/useAdminDashboard
import { useState, useEffect } from "react";
import { getAllProperties } from "../../helpers/services/PropertyService";
import { getAllEmployees } from "../../helpers/services/TeamService";
import { getAllContent } from "../../helpers/services/ContentService";
import { PropertyCard } from "../../Data/PropertyCard";
import { Employee_Profile } from "../../Data/Employee_Profile";
import { ContentPost_Data } from "../../Data/ContentPost_Data";

export const useAdminDashboard = (activeTab: string) => {
  const [loading, setLoading] = useState(false);

  // --- States ---
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [propPage, setPropPage] = useState(1);
  const [propTotalPages, setPropTotalPages] = useState(1);
  const [propTotalCount, setPropTotalCount] = useState(0);

  const [team, setTeam] = useState<Employee_Profile[]>([]);
  const [teamPage, setTeamPage] = useState(1);
  const [teamTotalPages, setTeamTotalPages] = useState(1);
  const [teamTotalCount, setTeamTotalCount] = useState(0);

  const [content, setContent] = useState<ContentPost_Data[]>([]);
  const [contentPage, setContentPage] = useState(1);
  const [contentTotalPages, setContentTotalPages] = useState(1);
  const [contentTotalCount, setContentTotalCount] = useState(0);

  // 🎯 Effect for Properties
  useEffect(() => {
    if (activeTab !== "properties") return;
    const fetchProps = async () => {
      setLoading(true);
      const data = await getAllProperties(propPage, 12);
      setProperties(data.items || []);
      setPropTotalPages(data.totalPages || 1);
      setPropTotalCount(data.totalCount || 0);
      setLoading(false);
    };
    fetchProps();
  }, [propPage, activeTab]);

  // 🎯 Effect for Team
  useEffect(() => {
    if (activeTab !== "team") return;
    const fetchTeam = async () => {
      setLoading(true);
      const data = await getAllEmployees(teamPage, 12);
      setTeam(data.items || []);
      setTeamTotalPages(data.totalPages || 1);
      setTeamTotalCount(data.totalCount || 0);
      setLoading(false);
    };
    fetchTeam();
  }, [teamPage, activeTab]);

  // 🎯 Effect for Content
  useEffect(() => {
    if (activeTab !== "content") return;
    const fetchContent = async () => {
      setLoading(true);
      const data = await getAllContent(contentPage, 12);
      setContent(data.items || []);
      setContentTotalPages(data.totalPages || 1);
      setContentTotalCount(data.totalCount || 0);
      setLoading(false);
    };
    fetchContent();
  }, [contentPage, activeTab]);

  return {
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
  };
};
