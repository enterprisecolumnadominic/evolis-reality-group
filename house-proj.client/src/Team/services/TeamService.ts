// src/Team/services/TeamService.ts
import { Employee_Profile } from "../../Data/Employee_Profile";

const API_URL = "https://localhost:7259/api/Employees";

export const fetchActiveTeam = async (): Promise<Employee_Profile[]> => {
  const response = await fetch(`${API_URL}?isActive=true`);

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
};
