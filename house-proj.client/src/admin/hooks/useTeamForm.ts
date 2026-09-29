import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyEmployeeState } from "../../Data/EmptyEmployeeState";
import {
  getEmployeeById,
  saveEmployee,
} from "../../helpers/services/TeamService";
import { Employee_Profile } from "../../Data/Employee_Profile";

export const useTeamForm = (urlId?: string) => {
  const navigate = useNavigate();
  const [formData, setFormData] =
    useState<Employee_Profile>(EmptyEmployeeState);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRealId =
    !!urlId &&
    urlId !== "undefined" &&
    urlId !== "00000000-0000-0000-0000-000000000000";

  useEffect(() => {
    if (!isRealId) {
      setFormData(EmptyEmployeeState);
      return;
    }

    setLoading(true);
    getEmployeeById(urlId!)
      .then((data) => {
        if (data) {
          setFormData({
            ...EmptyEmployeeState,
            ...data,
            id: data.id || urlId,
          });
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [urlId, isRealId]);

  const handleInputChange = (field: keyof Employee_Profile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (
    platform: keyof Employee_Profile["socials"],
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [platform]: value },
    }));
  };

  // --- FIX: Change handleCSVChange to handle raw strings ---
  const handleCSVChange = (
    field: "specialties" | "languages",
    value: string,
  ) => {
    // We stop splitting it into an array here.
    // We keep it as a string so backspacing/typing is 100% smooth.
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- FIX: Convert string to array only when saving ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanedData: Employee_Profile = {
      ...formData,
      // If it's a string (from typing), split it. If it's already an array, clean it.
      specialties:
        typeof formData.specialties === "string"
          ? (formData.specialties as string)
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s !== "")
          : (formData.specialties || [])
              .map((s) => s.trim())
              .filter((s) => s !== ""),

      languages:
        typeof formData.languages === "string"
          ? (formData.languages as string)
              .split(",")
              .map((l) => l.trim())
              .filter((l) => l !== "")
          : (formData.languages || [])
              .map((l) => l.trim())
              .filter((l) => l !== ""),
    };

    try {
      await saveEmployee(cleanedData);
      alert("Profile saved!");
      navigate("/dashboard");
    } catch (err) {
      alert("Error saving profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    loading,
    isSubmitting,
    isRealId,
    handleInputChange,
    handleSocialChange,
    handleCSVChange,
    handleSave,
  };
};
