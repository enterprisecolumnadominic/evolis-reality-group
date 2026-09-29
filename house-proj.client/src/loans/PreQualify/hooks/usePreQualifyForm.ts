import { useState, ChangeEvent, FormEvent, useRef } from "react";
import apiConfig from "../../../config/apiConfig.json";
import {
  PreQualifyRequest,
  PreQualifyRequestInitialFormState,
} from "../../../Data/PreQualifyRequest";
import { usePreQualify } from "./usePreQualify";

export const usePreQualifyForm = () => {
  // 1. Form State
  const [formData, setFormData] = useState<PreQualifyRequest>(
    PreQualifyRequestInitialFormState,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof PreQualifyRequest, string>>
  >({});

  // 2. Captcha & API State
  const [showSuccess, setShowSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null); // To reset captcha on failure

  const {
    submitPreQualify,
    loading: isSubmitting,
    error: apiError,
  } = usePreQualify();

  // 3. Validation Logic
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PreQualifyRequest, string>> = {};

    if (!formData.propertyType)
      newErrors.propertyType = "Property type is required.";
    if (!formData.propertyStatus)
      newErrors.propertyStatus = "Property status is required.";
    if (!formData.propertyValue || formData.propertyValue <= 0) {
      newErrors.propertyValue = "Please enter a valid property value.";
    }
    if (
      !formData.loanTenure ||
      formData.loanTenure < 1 ||
      formData.loanTenure > 25
    ) {
      newErrors.loanTenure = "Tenure must be between 1 and 25.";
    }

    if (!formData.employmentType)
      newErrors.employmentType = "Employment type is required.";
    if (!formData.monthlyIncome || formData.monthlyIncome <= 0) {
      newErrors.monthlyIncome = "Monthly income is required.";
    }
    if (formData.yearsEmployed === 0) {
      newErrors.yearsEmployed = "Please enter years of employment.";
    }

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.civilStatus)
      newErrors.civilStatus = "Civil status is required.";

    // Inside usePreQualifyForm.ts -> validate() function

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();

      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age if birthday hasn't occurred yet this year
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old.";
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.countryCode)
      newErrors.phoneNumber = "Country code is required.";
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (formData.phoneNumber.length < 7) {
      newErrors.phoneNumber = "Phone number is too short.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Handlers
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (errors[name as keyof PreQualifyRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const sanitizedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || "1990-01-01",
        // 🎯 Ensure these are NEVER empty strings if they are [Required] in C#
        employmentStatus: formData.employmentStatus || "Employed",
        propertyType: formData.propertyType || "House and Lot",
      };

      const result = await submitPreQualify(sanitizedData, captchaToken);

      if (result.success) {
        setShowSuccess(true);
        setFormData(PreQualifyRequestInitialFormState);
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } else {
        alert(result.error);
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } else {
      // Scroll to error logic...
      setTimeout(() => {
        const firstError = document.querySelector(".is-invalid");
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  return {
    formData,
    errors,
    showSuccess,
    setShowSuccess,
    handleChange,
    handleSubmit,
    isSubmitting,
    captchaToken,
    onCaptchaChange,
    recaptchaRef,
    recaptchaSiteKey: apiConfig.recaptcha.siteKey,
  };
};
