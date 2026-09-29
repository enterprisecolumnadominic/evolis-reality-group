import { useState } from "react";
import { useAuth as useAuthContext } from "./useAuthContext";
import { LoginRequest, AuthResponse } from "../../Data/AuthModels";
import ApiService from "../../helpers/services/ApiService";

export const useAuth = () => {
  const {
    login: contextLogin,
    logout: contextLogout,
    isAuthenticated,
  } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate (Get JWT)
      const authData = (await contextLogin(
        credentials,
      )) as unknown as AuthResponse;

      // 2. Set Header IMMEDIATELY
      // This is now the ONLY header needed for state-changing requests (PUT/POST/DELETE)
      const token = authData?.token || localStorage.getItem("jwt_token");
      if (token) {
        ApiService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (err: any) {
      setError(err || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    delete ApiService.defaults.headers.common["Authorization"];
    contextLogout();
  };

  return { login, logout, loading, error, isAuthenticated };
};
