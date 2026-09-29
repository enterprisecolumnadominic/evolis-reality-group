// src/data/AVAILABLE_PROPERTIES_MOCK.ts

import { Available_Properties } from "./Available_Properties";

export const Description_LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

export const mockVideolink = "https://www.youtube.com/embed/8zH2VfkV0Es";

export const AVAILABLE_PROPERTIES_MOCK: Available_Properties[] = [
  // --- 5 HOUSES (propertyType: "buy") ---
  {
    guid: "prop-001",
    name: "123 Main St",
    price: 123000, // 💰 Added Price
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 220.0,
    description: Description_LOREM_IPSUM,
    builtYear: 1995,
    address: "Anytown, CA",
    bedrooms: 4,
    bathrooms: 3,
    levels: 2,
    propertyType: "buy",
    subPropertyType: "House & Lot", // 🏠 Added Sub-Property Type
    latitude: 34.0522,
    longitude: -118.2437,
    isEnabled: true,
  },
  {
    guid: "prop-002",
    name: "45 Oak Ln",
    price: 450000,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 190.5,
    description: Description_LOREM_IPSUM,
    builtYear: 2001,
    address: "Springfield, IL",
    bedrooms: 3,
    bathrooms: 2,
    levels: 2,
    propertyType: "buy",
    subPropertyType: "House & Lot",
    latitude: 39.7817, // Springfield, IL
    longitude: -89.6501,
    isEnabled: true,
  },
  {
    guid: "prop-003",
    name: "90 Summit Dr",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 350.75,
    description: Description_LOREM_IPSUM,
    builtYear: 2012,
    address: "Beverly Hills, CA",
    bedrooms: 5,
    bathrooms: 4,
    levels: 3,
    propertyType: "buy",
    subPropertyType: "House & Lot",
    latitude: 34.0736, // Beverly Hills, CA
    longitude: -118.4004,
    isEnabled: true,
  },
  {
    guid: "prop-004",
    name: "75 Maple Ave",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 110.0,
    description: Description_LOREM_IPSUM,
    builtYear: 1988,
    address: "Phoenix, AZ",
    bedrooms: 3,
    bathrooms: 2,
    levels: 1,
    propertyType: "buy",
    subPropertyType: "House & Lot",
    latitude: 33.4484, // Phoenix, AZ
    longitude: -112.074,
    isEnabled: true,
  },
  {
    guid: "prop-005",
    name: "22 Lake View Dr",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 280.9,
    description: Description_LOREM_IPSUM,
    builtYear: 2008,
    address: "Lakeside, MI",
    bedrooms: 4,
    bathrooms: 4,
    levels: 2,
    propertyType: "buy",
    subPropertyType: "Condominium",
    latitude: 42.1062, // Lakeside, MI
    longitude: -86.5367,
    isEnabled: true,
  }, // --- 5 CONDO/APARTMENTS (propertyType: "buy") ---

  {
    guid: "prop-006",
    name: "1500 Gallery St, Unit 8A",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 75.0,
    description: Description_LOREM_IPSUM,
    builtYear: 2020,
    address: "New York, NY",
    bedrooms: 1,
    bathrooms: 1,
    levels: 1,
    propertyType: "buy",
    subPropertyType: "Commercial",
    latitude: 40.7128, // New York, NY
    longitude: -74.006,
    isEnabled: true,
  },
  {
    guid: "prop-007",
    name: "300 Ocean Blvd, Penthouse",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 180.2,
    description: Description_LOREM_IPSUM,
    builtYear: 2015,
    address: "Miami, FL",
    bedrooms: 3,
    bathrooms: 3,
    levels: 1,
    propertyType: "buy",
    subPropertyType: "House & Lot",
    latitude: 25.7617, // Miami, FL
    longitude: -80.1918,
    isEnabled: true,
  },
  {
    guid: "prop-008",
    name: "400 High Rise Tower, Unit 12B",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 65.0,
    description: Description_LOREM_IPSUM,
    builtYear: 2022,
    address: "Chicago, IL",
    bedrooms: 1,
    bathrooms: 1,
    levels: 1,
    propertyType: "buy",
    subPropertyType: "Condominium",
    latitude: 41.8781, // Chicago, IL
    longitude: -87.6298,
    isEnabled: true,
  },
  {
    guid: "prop-009",
    name: "789 Quiet Ln, Unit C",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 90.0,
    description: Description_LOREM_IPSUM,
    builtYear: 2005,
    address: "Seattle, WA",
    bedrooms: 2,
    bathrooms: 2,
    levels: 1,
    propertyType: "buy",
    subPropertyType: "Condominium",
    latitude: 47.6062, // Seattle, WA
    longitude: -122.3321,
    isEnabled: true,
  },
  {
    guid: "prop-010",
    name: "100 Riverwalk Pl, Unit 1A",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 110.5,
    description: Description_LOREM_IPSUM,
    builtYear: 2010,
    address: "Austin, TX",
    bedrooms: 2,
    bathrooms: 2,
    levels: 1,
    propertyType: "buy",
    subPropertyType: "Condominium",
    latitude: 30.2672, // Austin, TX
    longitude: -97.7431,
    isEnabled: false, // Disabled for testing filter logic
  }, // -------------------------------------------------------------------------------------------------- // --- NEW RENTAL PROPERTIES (prop-011 through prop-017) --- // --------------------------------------------------------------------------------------------------

  {
    guid: "prop-011",
    name: "450 Broadway Ave, Apt 2C",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 85.0,
    description: Description_LOREM_IPSUM,
    builtYear: 1998,
    address: "Boston, MA",
    bedrooms: 2,
    bathrooms: 1,
    levels: 1,
    propertyType: "rent",
    subPropertyType: "Condominium",
    latitude: 42.3601, // Boston, MA
    longitude: -71.0589,
    isEnabled: true,
  },
  {
    guid: "prop-012",
    name: "88 Hillside Terrace",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 150.0,
    description: Description_LOREM_IPSUM,
    builtYear: 2004,
    address: "Portland, OR",
    bedrooms: 3,
    bathrooms: 2,
    levels: 2,
    propertyType: "rent",
    subPropertyType: "Condominium",
    latitude: 45.5152, // Portland, OR
    longitude: -122.6784,
    isEnabled: true,
  },
  {
    guid: "prop-013",
    name: "20 Central Park West, Unit 14D",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 120.0,
    description: Description_LOREM_IPSUM,
    builtYear: 2018,
    address: "New York, NY",
    bedrooms: 2,
    bathrooms: 2,
    levels: 1,
    propertyType: "rent",
    subPropertyType: "Condominium",
    latitude: 40.7812, // New York (Central Park West area)
    longitude: -73.9667,
    isEnabled: true,
  },
  {
    guid: "prop-014",
    name: "111 Commerce Tower, Suite 3200",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 55.0,
    description: Description_LOREM_IPSUM,
    builtYear: 2023,
    address: "Houston, TX",
    bedrooms: 0,
    bathrooms: 1,
    levels: 1,
    propertyType: "rent",
    subPropertyType: "Condominium",
    latitude: 29.7604, // Houston, TX
    longitude: -95.3698,
    isEnabled: true,
  },
  {
    guid: "prop-015",
    name: "50 Riverbend Rd, Cabin 3",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 95.0,
    description: Description_LOREM_IPSUM,
    builtYear: 1985,
    address: "Asheville, NC",
    bedrooms: 2,
    bathrooms: 1,
    levels: 1,
    propertyType: "rent",
    subPropertyType: "Condominium",
    latitude: 35.5951, // Asheville, NC
    longitude: -82.5515,
    isEnabled: true,
  },
  {
    guid: "prop-016",
    name: "99 Tech Center Blvd, Unit 105",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 70.0,
    description: Description_LOREM_IPSUM,
    builtYear: 2019,
    address: "San Jose, CA",
    bedrooms: 1,
    bathrooms: 1,
    levels: 1,
    propertyType: "rent",
    subPropertyType: "Condominium",
    latitude: 37.3382, // San Jose, CA
    longitude: -121.8863,
    isEnabled: true,
  },
  {
    guid: "prop-017",
    name: "60 South Blvd, Townhouse B",
    price: 350750,
    imageURL: [
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393",
      "https://images.unsplash.com/photo-1725962479542-1be0a6b0d444",
      "https://images.unsplash.com/photo-1631458325834-8f678e48912c",
      { videoUrl: mockVideolink }, // 🎥 Slot 4 is now a VideoLink object
    ],
    floorSpace: 180.0,
    description: Description_LOREM_IPSUM,
    builtYear: 2000,
    address: "Dallas, TX",
    bedrooms: 3,
    bathrooms: 2,
    levels: 2,
    propertyType: "rent",
    subPropertyType: "Condominium",
    latitude: 32.7767, // Dallas, TX
    longitude: -96.797,
    isEnabled: true,
  },
];
