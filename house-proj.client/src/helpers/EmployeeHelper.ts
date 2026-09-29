import { Employee_Profile } from "../Data/Employee_Profile";

// 🔑 The "Source of Truth" for a new Team Member
export const EMPTY_EMPLOYEE_STATE: Employee_Profile = {
  id: "",
  name: "",
  title: "",
  email: "",
  phone: "",
  profilePhoto: "",
  bodyPhoto: "",
  description: "",
  specialties: [],
  languages: ["English"], // Default language
  socials: {
    // Lowercase
    linkedin: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
  },
  isActive: true,
};
