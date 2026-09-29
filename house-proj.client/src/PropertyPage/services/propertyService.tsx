// src/services/propertyService.ts
import { AVAILABLE_PROPERTIES_MOCK } from "../../Data/Available_Properties_Mock";
import { Available_Properties } from "../../Data/Available_Properties";

export const getPropertyByGuid = async (
  guid: string,
): Promise<Available_Properties | null> => {
  // Simulate an API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const found =
        AVAILABLE_PROPERTIES_MOCK.find((p) => p.id === guid) || null;
      resolve(found);
    }, 300);
  });
};
