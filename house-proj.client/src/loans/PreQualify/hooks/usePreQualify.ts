import { useState } from "react";
import { PreQualifyRequest } from "../../../Data/PreQualifyRequest";
import { submitPreQualifyRequest } from "../../../helpers/services/PreQualifyService";

export const usePreQualify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitPreQualify = async (
    formData: Omit<PreQualifyRequest, "captchaToken">,
    captchaToken: string | null,
  ) => {
    if (!captchaToken) {
      const errMsg = "Please complete the CAPTCHA verification.";
      setError(errMsg);
      return { success: false, error: errMsg };
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 🎯 Data Prep: Combine form data with token
      const payload: PreQualifyRequest = {
        ...formData,
        captchaToken,
        // Ensure C# receives just the date part if using DateOnly
        dateOfBirth: formData.dateOfBirth.split("T")[0],
      };

      // 🎯 The Axios Call
      await submitPreQualifyRequest(payload);

      setSuccess(true);
      return { success: true };
    } catch (err: any) {
      // 🎯 Axios Error Handling
      // C# Validation errors are usually in err.response.data.errors
      const backendErrors = err.response?.data?.errors;
      const errorMessage = backendErrors
        ? Object.values(backendErrors).flat().join(", ")
        : err.response?.data?.title || err.message || "Something went wrong";

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { submitPreQualify, loading, error, success, setSuccess };
};
