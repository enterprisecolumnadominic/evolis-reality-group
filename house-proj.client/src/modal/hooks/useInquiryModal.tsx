import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { sendPropertyInquiry } from "../../helpers/services/InquiryService";
import { InquiryData } from "../../Data/InquiryData";
import config from "../../config/apiConfig.json";

export const useInquiryModal = (
  propertyName: string,
  onClose: () => void,
  agentEmail: string,
) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorType, setErrorType] = useState<
    "rate-limit" | "generic" | "validation" | null
  >(null);

  // 🎯 1. Create the errors state (This fixes the "Cannot find name 'errors'" issue)
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+63",
    phone: "",
    message: `I am interested in ${propertyName}. Please provide more details.`,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error red border as soon as the user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // 🎯 2. The Validation Logic
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim() || !formData.email.includes("@"))
      newErrors.email = true;
    if (!formData.message.trim()) newErrors.message = true;

    // 🎯 ADD THIS: Check if phone is empty
    if (!formData.phone.trim()) newErrors.phone = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🎯 3. Run validation before trying to submit
    if (!validateForm()) {
      setErrorType("validation");
      return;
    }

    if (!captchaToken) {
      alert("Please complete the captcha.");
      return;
    }

    setIsSubmitting(true);
    setErrorType(null);

    const payload: InquiryData = {
      name: formData.name,
      email: formData.email,
      phone: `${formData.countryCode}${formData.phone}`,
      message: formData.message,
      propertyName,
      captchaToken,
      employeeEmail: agentEmail,
    };

    try {
      await sendPropertyInquiry(payload);
      setIsSuccess(true);
      setCaptchaToken(null);
      recaptchaRef.current?.reset();

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 3500);
    } catch (err: any) {
      if (err.status === 429 || err.response?.status === 429) {
        setErrorType("rate-limit");
      } else {
        setErrorType("generic");
      }
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    isSuccess,
    errorType,
    errors, // 🎯 4. Export errors so the Component can see them
    captchaToken,
    recaptchaRef,
    recaptchaSiteKey: config.recaptcha.siteKey,
    handleChange,
    onCaptchaChange,
    handleSubmit,
  };
};
