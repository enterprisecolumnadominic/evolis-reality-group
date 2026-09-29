/* src/admin/hooks/useContentForm.ts */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyContentState } from "../../Data/ContentPost_Data";
import {
  getContentById,
  saveContent,
} from "../../helpers/services/ContentService";
import { ContentPost_Data } from "../../Data/ContentPost_Data";

export const useContentForm = (urlId?: string) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ContentPost_Data>(EmptyContentState);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isRealId =
      urlId &&
      urlId !== "undefined" &&
      urlId !== "00000000-0000-0000-0000-000000000000";

    if (isRealId) {
      setLoading(true);
      getContentById(urlId)
        .then((data) => {
          if (data) {
            setFormData({
              ...data,
              id: data.id || data.guid || data.Guid || urlId, // Normalize the ID
              tags: Array.isArray(data.tags) ? data.tags : [],
            });
          }
        })
        .catch((err) => console.error("Error fetching content:", err))
        .finally(() => setLoading(false));
    } else {
      setFormData(EmptyContentState);
    }
  }, [urlId]);

  const handleInputChange = (field: keyof ContentPost_Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Prepare the payload
    const payload = {
      ...formData,
      id: urlId || formData.id,
      // 2. Ensure dates are converted to ISO strings (which include the 'Z' for UTC)
      publishedDate: formData.publishedDate
        ? new Date(formData.publishedDate).toISOString()
        : new Date().toISOString(),
      eventDate: formData.eventDate
        ? new Date(formData.eventDate).toISOString()
        : null,
    };

    try {
      await saveContent(payload);
      alert("Content saved successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      // 3. Better error logging to see exactly what the server dislikes
      const errorMessage = err.response?.data || "Error saving content.";
      alert(`Save Failed: ${errorMessage}`);
      console.error("Full Error Object:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, loading, isSubmitting, handleInputChange, handleSave };
};
