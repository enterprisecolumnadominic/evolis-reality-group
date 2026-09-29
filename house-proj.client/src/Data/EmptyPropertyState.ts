//src/Data/EmptyPropertyState.ts

import { Available_Properties } from "./Available_Properties";

export const EmptyPropertyState: Available_Properties = {
  id: "00000000-0000-0000-0000-000000000000",
  guid: "00000000-0000-0000-0000-000000000000",
  name: "",
  price: 0,
  // Initialize with 4 image slots and 1 video slot as per your Swagger
  mediaItems: [
    { url: "", videoDetails: null },
    { url: "", videoDetails: null },
    { url: "", videoDetails: null },
    { url: "", videoDetails: null },
    { url: null, videoDetails: { videoUrl: "" } },
  ],
  floorSpace: 0,
  description: "",
  builtYear: new Date().getFullYear(),
  address: "",
  bedrooms: 0,
  bathrooms: 0,
  levels: 1,
  latitude: 0,
  longitude: 0,
  dateCreated: "",
  propertyType: 0, // Default to Buy
  subPropertyType: 0, // Default to Lot
  isEnabled: true,
  employeeProfileID: "",
};
