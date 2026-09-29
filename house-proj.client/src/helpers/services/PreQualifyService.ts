import ApiService from "./ApiService";
import apiConfig from "../../config/apiConfig.json";
import { PreQualifyRequest } from "../../Data/PreQualifyRequest";

export const submitPreQualifyRequest = async (payload: PreQualifyRequest) => {
  // ApiService (Axios) automatically handles headers and JSON stringify
  return await ApiService.post(apiConfig.endpoints.preQualify, payload);
};
