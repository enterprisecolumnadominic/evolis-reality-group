//src/helpers/services/ApiService.ts

import axios from "axios";
import apiConfig from "../../config/apiConfig.json";

const ApiService = axios.create({
  baseURL: apiConfig.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Version": "1.0",
  },
});

// 🎯 REQUEST INTERCEPTOR: Automatically attach the Token
ApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 🎯 RESPONSE INTERCEPTOR: Handle Global Errors (like 401 Unauthorized)
ApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Redirecting to login...");
      localStorage.removeItem("adminToken");
      // Optional: window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default ApiService;
