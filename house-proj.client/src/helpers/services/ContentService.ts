import apiConfig from "../../config/apiConfig.json";
import ApiService from "./ApiService";
import { ContentPost_Data } from "../../Data/ContentPost_Data";

export const getAllContent = async (
  pageNumber: number = 1,
  pageSize: number = 12,
  isEnabled: boolean | null = null,
  type?: "Blog" | "Event",
) => {
  // 🎯 Use the cleaned variable to prevent the "false" error
  const cleanPageSize = typeof pageSize === "number" ? pageSize : 12;

  let url = `${apiConfig.endpoints.content}?pageNumber=${pageNumber}&pageSize=${cleanPageSize}`;

  if (isEnabled !== null) url += `&isEnabled=${isEnabled}`;
  if (type) url += `&type=${type}`;

  const response = await ApiService.get(url);
  return response.data;
};

export const getContentById = async (id: string) => {
  const response = await ApiService.get(`${apiConfig.endpoints.content}/${id}`);
  return response.data;
};

export const saveContent = async (contentData: ContentPost_Data) => {
  // 1. Determine if this is a Create or Update operation
  const isNew =
    !contentData.id ||
    contentData.id === "00000000-0000-0000-0000-000000000000";

  // 2. Prepare the Payload
  // We explicitly set 'Guid' to match the C# Backend expected property name
  const payload = {
    ...contentData,
    Guid: isNew ? "00000000-0000-0000-0000-000000000000" : contentData.id,
    isActive: contentData.isActive ?? true,
  };

  try {
    // 3. Execute the appropriate HTTP request
    const response = isNew
      ? await ApiService.post(apiConfig.endpoints.content, payload)
      : await ApiService.put(
          `${apiConfig.endpoints.content}/${contentData.id}`,
          payload,
        );

    return response.data;
  } catch (error: any) {
    // 4. Enhanced Error Logging for Debugging
    if (error.response) {
      console.error(
        `❌ SERVER ERROR (${error.response.status}):`,
        error.response.data,
      );

      // Log validation errors in a readable table format if they exist
      if (error.response.data.errors) {
        console.table(error.response.data.errors);
      }
    } else {
      console.error("❌ Network/Setup Error:", error.message);
    }

    // Re-throw so the UI (useContentForm) can handle the user notification
    throw error;
  }
};

export const getContentBySlug = async (type: string, slug: string) => {
  // Ensure this matches the hit you just made in the browser
  const response = await ApiService.get(`/Content/${type}/${slug}`);
  return response.data;
};
