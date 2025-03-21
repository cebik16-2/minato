import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import useLoginForm from "../../hooks/useLoginForm";
import { LOGIN_MESSAGES, PLACEHOLDERS } from "../../constants/messages";
import "../../styles/pages/Login.css";

const Login = ({ handleLogin }) => {
  const {
    email,
    password,
    error,
    setEmail,
    setPassword,
    setError,
  } = useLoginForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        handleLogin(email, password); // Call handleLogin from props
        navigate("/admin"); // Redirect after login
      } else {
        setError(LOGIN_MESSAGES.INVALID_CREDENTIALS);
      }
    } catch (err) {
      setError(LOGIN_MESSAGES.INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
  );
};

export default Login;