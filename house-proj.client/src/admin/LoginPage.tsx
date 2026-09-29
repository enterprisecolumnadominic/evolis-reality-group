import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BUSINESS_CONFIG } from "../config/BusinessConfig";
import { useAuth } from "../admin/hooks/useAuth";
import "./LoginPage.css";
import PageMeta from "../config/PageMeta";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password });

      // If we reach this line, login was successful
      navigate("/dashboard");
    } catch (err) {
      console.error("Login attempt failed:", err);
    }
  };

  return (
    <div id="login-container">
      <PageMeta pageKey="admin" />

      <div className="login-glass-card">
        <header className="login-header">
          <h1>Admin Portal</h1>
          <p>
            Please enter your credentials to manage {BUSINESS_CONFIG.brandName}
            properties.
          </p>
        </header>

        <form onSubmit={handleLogin} className="login-form">
          {/* 🎯 Display error message if the API returns one */}
          {error && <div className="login-error-banner">{error}</div>}

          <div className="login-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            © {new Date().getFullYear()} {BUSINESS_CONFIG.brandName} Admin
            System
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
