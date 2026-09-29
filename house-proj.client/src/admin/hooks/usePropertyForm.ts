import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 1. Point to your new file
import { EmptyPropertyState } from "../../Data/EmptyPropertyState";
import {
  getPropertyByGuid,
  saveProperty,
} from "../../helpers/services/PropertyService";
import { Available_Properties } from "../../Data/Available_Properties";

const formatEmbedUrl = (url: string) => {
  if (!url) return "";

  // Regex to capture YouTube IDs from: watch?v=, youtu.be/, shorts/, or embed/
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  // If it's a Vimeo link, handle that too
  if (url.includes("vimeo.com")) {
    const vimeoId = url.split("/").pop();
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  return url; // Return original if it doesn't match
};

export const usePropertyForm = (id?: string) => {
  const navigate = useNavigate();
  const [formData, setFormData] =
    useState<Available_Properties>(EmptyPropertyState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    // 🎯 Logic Check: id must exist and not be the string "undefined"
    if (id && id !== "undefined") {
      const fetchProperty = async () => {
        try {
          setLoading(true);
          const data = await getPropertyByGuid(id);
          setFormData(data);
        } catch (err) {
          console.error("Error loading property:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    } else {
      // 🎯 If no id, reset to empty for a "New Entry"
      setFormData(EmptyPropertyState);
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (field: keyof Available_Properties, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newMedia = [...prev.mediaItems];

      if (index === 4) {
        // 🎯 AUTO-FIX: We clean the URL the moment it is pasted!
        const cleanUrl = formatEmbedUrl(value);

        newMedia[4] = {
          url: null,
          videoDetails: { videoUrl: cleanUrl },
        };
      } else {
        // Regular images remain the same
        newMedia[index] = {
          ...newMedia[index],
          url: value,
          videoDetails: null,
        };
      }

      return { ...prev, mediaItems: newMedia };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. DESTRUCTURE to strip out the helper strings that cause the "Zero-Overwrite" bug
    // We take the strings out and keep everything else in 'restOfData'
    const {
      employeeProfileIDString,
      guidString,
      dateCreatedString,
      ...restOfData
    } = formData;

    try {
      // 2. CONSTRUCT the clean payload
      const payload = {
        ...restOfData, // Spread the cleaned data (no shadow strings here!)

        // Ensure the IDs match what the backend expects
        id: id && id !== "new" ? id : "00000000-0000-0000-0000-000000000000",
        guid: id && id !== "new" ? id : "00000000-0000-0000-0000-000000000000",

        // Use the actual Guid string for the employee
        employeeProfileID:
          formData.employeeProfileID || "00000000-0000-0000-0000-000000000000",

        // Explicitly cast numeric types to ensure .NET doesn't reject the dynamic types
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        floorSpace: Number(formData.floorSpace),
        levels: Number(formData.levels),
        builtYear: Number(formData.builtYear),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        propertyType: Number(formData.propertyType),
        subPropertyType: Number(formData.subPropertyType),

        // Filter out empty media slots
        mediaItems: formData.mediaItems.filter(
          (item) => item.url?.trim() || item.videoDetails?.videoUrl?.trim(),
        ),
      };

      console.log(
        "DEBUG: Final Payload to API (Cleaned):",
        JSON.stringify(payload, null, 2),
      );

      // 3. SEND to the service
      await saveProperty(payload);

      alert("Property saved successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Save Error Detailed:", err.response?.data || err.message);
      alert(
        `Error saving property: ${err.response?.data?.title || "Check console for data format issues."}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    formData,
    loading,
    isSubmitting,
    handleInputChange,
    handleImageChange,
    handleSave,
    navigate,
  };
};
