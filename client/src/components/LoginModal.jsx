// LoginModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import useLoginForm from "../hooks/useLoginForm";
import { LOGIN_MESSAGES, PLACEHOLDERS } from "../constants/messages";
import { useAuth } from "../context/AuthContext";
import "../styles/components/LoginModal.css";

const LoginModal = () => {
  const { email, password, error, setEmail, setPassword, setError } = useLoginForm();
  const { login, closeLoginModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);
      console.log("🔐 Login response:", data);

      if (data?.token) {
        login(data.token);
        closeLoginModal();
        navigate("/listings");
      } else {
        setError(LOGIN_MESSAGES.INVALID_CREDENTIALS);
        console.warn("⚠️ Missing token in response:", data);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMsg =
        err?.message === "Failed to fetch"
          ? "Cannot connect to server. Check your network or backend."
          : err?.message || LOGIN_MESSAGES.INVALID_CREDENTIALS;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={PLACEHOLDERS.EMAIL}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={PLACEHOLDERS.PASSWORD}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
