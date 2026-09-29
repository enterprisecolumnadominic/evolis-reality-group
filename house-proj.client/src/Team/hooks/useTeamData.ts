// src/Team/hooks/useTeamData.ts
import { useState, useEffect } from "react";
import { getAllEmployees } from "../../helpers/services/TeamService";
import { Employee_Profile } from "../../Data/Employee_Profile";

export const useTeamData = (isActive: boolean = true, page: number = 1) => {
  const [team, setTeam] = useState<Employee_Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        // We pass 'page', and a pageSize of 1 for your test
        const response = await getAllEmployees(page, 12, isActive);

        // 🎯 FIX: Match the exact JSON keys from your response
        const items = response?.items || [];
        const pages = response?.totalPages || 1; // lowercase 't'

        console.log("Hook received totalPages:", pages);

        setTeam(items);
        setTotalPages(pages);
      } catch (err: any) {
        setError(err.message || "Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [isActive, page]);

  return { team, loading, error, totalPages };
};
