import { InquiryData } from "../../Data/InquiryData";
import ApiService from "./ApiService";
import apiConfig from "../../config/apiConfig.json";

export const sendPropertyInquiry = async (data: InquiryData) => {
  try {
    // This hits https://localhost:7259/api/Inquiry/send
    const response = await ApiService.post(apiConfig.endpoints.emailSend, data);
    return response.data;
  } catch (error) {
    console.error("Inquiry Submission Error:", error);
    throw error;
  }
};
