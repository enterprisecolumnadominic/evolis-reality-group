export interface PreQualifyRequest {
  // Property Information
  propertyType: string;
  propertyStatus: string;
  propertyValue: number;
  // Loan Details
  loanTenure: number;

  // Employment Information
  employmentType: string;
  employmentStatus: string;
  yearsEmployed: number;
  monthlyIncome: number;

  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  civilStatus: string;
  email: string;
  countryCode: string;
  phoneNumber: string;

  captchaToken: string;
}

export const PreQualifyRequestInitialFormState: PreQualifyRequest = {
  propertyType: "",
  propertyStatus: "",
  propertyValue: 0,
  loanTenure: 0,
  employmentType: "",
  employmentStatus: "",
  yearsEmployed: 0,
  monthlyIncome: 0,
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  civilStatus: "",
  email: "",
  countryCode: "+63",
  phoneNumber: "",
  captchaToken: "",
};
