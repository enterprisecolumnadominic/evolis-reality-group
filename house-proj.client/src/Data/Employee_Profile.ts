// src/Data/Employee_Profile.ts

export interface SocialLinks {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
}

export interface Employee_Profile {
  id: string; // Already lowercase because of [JsonPropertyName("id")]
  name: string;
  title: string;
  email: string;
  phone: string;
  profilePhoto: string;
  bodyPhoto: string;
  description: string;
  specialties: string[]; // Lowercase
  languages: string[]; // Lowercase
  socials: {
    // Lowercase
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  isActive: boolean;
}
