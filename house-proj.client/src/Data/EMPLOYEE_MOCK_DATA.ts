//src/Data/EMPLOYEE_MOCK_DATA.ts

import { Description_LOREM_IPSUM } from "./Available_Properties_Mock";
import { Employee_Profile } from "./Employee_Profile";

export const EMPLOYEE_MOCK_DATA: Employee_Profile[] = [
  {
    guid: "emp-001",
    name: "Anya Sharma",
    title: "Senior Sales Broker",
    email: "anya.sharma@example.com",
    phone: "+1-555-123-4567",
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    bodyPhoto: "https://images.unsplash.com/photo-1622842182823-28bfbfba47e3",
    description: Description_LOREM_IPSUM,

    // Primary focus and specialties
    specialties: ["Luxury Homes", "Waterfront Properties", "Investment Sales"],
    languages: ["English", "Hindi"],

    // Social Links
    socials: {
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
    isActive: true,
  },
  {
    guid: "emp-002",
    name: "David Chen",
    title: "Rental & Leasing Specialist",
    email: "david.chen@example.com",
    phone: "+1-555-987-6543",
    profilePhoto:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    bodyPhoto: "https://images.unsplash.com/photo-1639747280929-e84ef392c69a",
    description: Description_LOREM_IPSUM,

    // Primary focus and specialties
    specialties: [
      "Apartment Rentals",
      "Commercial Leasing",
      "Property Management",
    ],
    languages: ["English", "Mandarin"],

    // Social Links
    socials: {
      linkedin: "https://linkedin.com/",
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      youtube: "https://youtube.com/",
    },
    isActive: true,
  },
];
