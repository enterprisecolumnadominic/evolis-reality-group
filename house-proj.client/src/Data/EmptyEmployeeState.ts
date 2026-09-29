import { Employee_Profile } from "./Employee_Profile";

export const EmptyEmployeeState: Employee_Profile = {
  id: "", // Sent as "00000000-0000-0000-0000-000000000000" to C# for new entries
  name: "",
  title: "",
  email: "",
  phone: "",
  profilePhoto: "",
  bodyPhoto: "",
  description: "",
  specialties: [], // Initialized as empty array
  languages: [], // Initialized as empty array
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
