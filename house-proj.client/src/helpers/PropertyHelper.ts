import { Available_Properties } from "../Data/Available_Properties";

// 🔑 This is your "Source of Truth" for a fresh form
export const EMPTY_PROPERTY_STATE: Available_Properties = {
  id: "",
  name: "",
  price: 0,
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
  propertyType: 0, // Default to Buy
  subPropertyType: 0, // Default to Lot
  isEnabled: true,
};
