// src/helpers/services/TeamService.ts
import apiConfig from "../../config/apiConfig.json";
import ApiService from "./ApiService";

export const getAllEmployees = async (
  pageNumber: number = 1,
  pageSize: number = 12,
  isActive?: boolean,
) => {
  let url = `${apiConfig.endpoints.team}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

  if (isActive !== undefined) {
    // 🎯 Use 'isActive' to match the [FromQuery] parameter in your C# Controller
    url += `&isActive=${isActive}`;
  }

  const response = await ApiService.get(url);

  // 🎯 Note: response.data is now { items: [], totalCount: X, totalPages: Y ... }
  return response.data;
};

export const getEmployeeById = async (guid: string) => {
  const response = await ApiService.get(`${apiConfig.endpoints.team}/${guid}`);
  return response.data;
};

export const saveEmployee = async (employeeData: any) => {
  const currentId = employeeData.id || employeeData.guid || employeeData.Guid;

  const isNew =
    !currentId ||
    currentId === "00000000-0000-0000-0000-000000000000" ||
    currentId === "";

  if (isNew) {
    // 🎯 POST: Create new
    // Clone and ensure we don't send the "Zero GUID" as the actual ID
    const { id, guid, Guid, ...postData } = employeeData;

    // We send a clean object. If the C# model requires a GUID,
    // the backend Service/Repository should assign Guid.NewGuid()
    return await ApiService.post(apiConfig.endpoints.team, postData);
  } else {
    // 🎯 PUT: Update existing
    return await ApiService.put(
      `${apiConfig.endpoints.team}/${currentId}`,
      employeeData,
    );
  }
};
