//src/helpers/services/PropertyService.ts

import apiConfig from "../../config/apiConfig.json";
import { Available_Properties } from "../../Data/Available_Properties";
import ApiService from "./ApiService";
import { PagedResponse } from "../../Data/PagedResponse";
import { PropertyCard } from "../../Data/PropertyCard";

const mapToPropertyCard = (item: any): PropertyCard => {
  return {
    // 🎯 Use 'guid' from your specific API result
    id: item.guid || item.id || item.Id,
    name: item.name || item.Name || "Untitled",
    price: Number(item.price ?? item.Price ?? 0),
    address: item.address || item.Address || "",
    bedrooms: Number(item.bedrooms ?? item.Bedrooms ?? 0),
    bathrooms: Number(item.bathrooms ?? item.Bathrooms ?? 0),
    floorSpace: Number(item.floorSpace ?? item.FloorSpace ?? 0),
    levels: Number(item.levels ?? item.Levels ?? 1),

    // 🎯 Prioritize the thumbnailUrl the API is already sending
    thumbnailUrl:
      item.thumbnailUrl ||
      item.MediaItems?.[0]?.Url ||
      "https://placehold.co/600x400",

    propertyType: Number(item.propertyType ?? item.PropertyType),
    subPropertyType: Number(item.subPropertyType ?? item.SubPropertyType),
    isEnabled: item.isEnabled === true || item.IsEnabled === true,
    dateCreated: item.dateCreated || item.DateCreated,
  };
};

export const getAllProperties = async (
  pageNumber = 1,
  pageSize = 12,
  isEnabled?: boolean,
): Promise<PagedResponse<PropertyCard>> => {
  const params = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  if (isEnabled !== undefined && isEnabled !== null) {
    params.append("isEnabled", isEnabled.toString());
  }

  const response = await ApiService.get(
    `${apiConfig.endpoints.properties}?${params.toString()}`,
  );

  // 🎯 Transform the items here
  return {
    ...response.data,
    items: (response.data.items || []).map(mapToPropertyCard),
  };
};

export const saveProperty = async (propertyData: Available_Properties) => {
  const isNew =
    !propertyData.id ||
    propertyData.id === "" ||
    propertyData.id === "00000000-0000-0000-0000-000000000000";

  // 🎯 FIX: Prepare the final payload for C#
  const payload = {
    ...propertyData,
    // C# expects "guid" (PascalCase in model usually, but case-sensitivity matters here)
    guid: isNew ? "00000000-0000-0000-0000-000000000000" : propertyData.id,
    id: isNew ? "00000000-0000-0000-0000-000000000000" : propertyData.id,

    // 🎯 CRITICAL FIX: DateOnly requires YYYY-MM-DD (No Time!)
    dateCreated: propertyData.dateCreated
      ? propertyData.dateCreated.split("T")[0]
      : new Date().toISOString().split("T")[0],
  };
  try {
    if (!isNew) {
      // 🎯 PUT: api/properties/{guid}
      console.log(`Updating property: ${propertyData.id}`);
      const response = await ApiService.put(
        `${apiConfig.endpoints.properties}/${propertyData.id}`,
        payload,
      );
      return response;
    } else {
      // 🎯 POST: api/properties
      console.log("Creating new property...");
      const response = await ApiService.post(
        apiConfig.endpoints.properties,
        payload,
      );
      return response;
    }
  } catch (error) {
    console.error("Error in saveProperty:", error);
    throw error; // Re-throw so the UI (AddPropertyPage) can show an error message
  }
};

export const getPropertyByGuid = async (
  id: string,
): Promise<Available_Properties> => {
  // 🎯 Make sure the endpoint matches your C# Controller route
  // (usually /api/properties/{id})
  const response = await ApiService.get(
    `${apiConfig.endpoints.properties}/${id}`,
  );

  return response.data;
};

// src/helpers/services/PropertyService.ts

export const getPropertiesPaged = async (
  size = 12,
  name = "",
  address = "",
  type?: number,
  subType?: number,
  token?: string,
): Promise<PagedResponse<PropertyCard>> => {
  const params = new URLSearchParams();
  params.append("pageSize", size.toString());

  if (name) params.append("nameTerm", name);
  if (address) params.append("addressTerm", address);
  if (type !== undefined && type !== null)
    params.append("type", type.toString());
  if (subType !== undefined && subType !== null)
    params.append("subType", subType.toString());

  // 🎯 CRITICAL: URLSearchParams automatically encodes the token
  if (token) {
    params.append("continuationToken", token);
  }

  // 🎯 Use .get()
  const response = await ApiService.get(
    `${apiConfig.endpoints.properties}/paged?${params.toString()}`,
  );

  return {
    ...response.data,
    items: (response.data.items || []).map(mapToPropertyCard),
  };
};
