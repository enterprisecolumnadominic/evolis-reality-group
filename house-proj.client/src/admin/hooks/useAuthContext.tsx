import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../../helpers/services/ApiService";
import { LoginRequest, AuthResponse } from "../../Data/AuthModels";
import apiConfig from "../../config/apiConfig.json";

interface AuthContextType {
  token: string | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt_token"),
  );

  useEffect(() => {
    const interceptor = ApiService.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => ApiService.interceptors.request.eject(interceptor);
  }, [token]);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await ApiService.post<AuthResponse>(
        apiConfig.endpoints.login,
        credentials,
      );

      const { token: newToken, email } = response.data;

      localStorage.setItem("jwt_token", newToken);
      localStorage.setItem("admin_email", email);

      ApiService.defaults.headers.common["Authorization"] =
        `Bearer ${newToken}`;

      setToken(newToken);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || "Login failed";
    }
  };

  const logout = async () => {
    try {
      // 1. Hit the backend to clear the "X-Visitor" and "X-Request" cookies
      await ApiService.post(apiConfig.endpoints.logout);
      console.log("✅ Server-side session cleared");
    } catch (error) {
      console.error("Logout handshake failed:", error);
    } finally {
      // 2. Clean up local storage
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("admin_email");

      // 3. Clean up the Axios headers
      delete ApiService.defaults.headers.common["Authorization"];

      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
