import React, { useState } from "react";
import { loginUser } from "../services/api"; // ✅ Correct path
import useLoginForm from "../hooks/useLoginForm"; // ✅ Correct path
import { LOGIN_MESSAGES, PLACEHOLDERS } from "../constants/messages"; // ✅ Correct path
import { useAuth } from "../context/AuthContext"; // ✅ Correct path
import "../styles/components/LoginModal.css"; // ✅ Correct path

const LoginModal = () => {
  const {
    email,
    password,
    error,
    setEmail,
    setPassword,
    setError,
  } = useLoginForm();

  const { login, closeLoginModal } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);
      console.log("🔐 Login response:", data);

      if (data?.token && typeof data.token === "string") {
        login(data.token);
        closeLoginModal();
      } else {
        console.warn("⚠️ Token missing or invalid in response:", data);
        setError(LOGIN_MESSAGES.INVALID_CREDENTIALS);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(LOGIN_MESSAGES.INVALID_CREDENTIALS);
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
