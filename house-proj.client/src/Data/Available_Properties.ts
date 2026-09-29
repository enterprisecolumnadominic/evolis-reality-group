//src/Data/Available_Properties.ts

export interface VideoDetails {
  videoUrl: string | null;
}

export interface MediaItem {
  url: string | null;
  videoDetails: VideoDetails | null;
}

export interface Available_Properties {
  [key: string]: any;

  id: string;
  guid: string;
  name: string;
  price: number;
  mediaItems: MediaItem[];
  floorSpace: number;
  description: string;
  builtYear: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  levels: number;
  latitude: number;
  longitude: number;
  propertyType: number;
  subPropertyType: number;
  isEnabled: boolean;
  dateCreated: string;
  employeeProfileID: string;
}
