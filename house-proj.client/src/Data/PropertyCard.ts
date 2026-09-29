// src/data/PropertyCard.ts

export interface PropertyCard {
  id: string;
  name: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  floorSpace: number;
  levels: number;
  thumbnailUrl: string;
  propertyType: number;
  subPropertyType: number;
  isEnabled: boolean;
  dateCreated: Date;
}
