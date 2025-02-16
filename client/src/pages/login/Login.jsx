import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import useLoginForm from "../../hooks/useLoginForm";
import { LOGIN_MESSAGES, PLACEHOLDERS } from "../../constants/messages";
import "../../styles/pages/Login.css";

const Login = () => {
  const {
    email, // ✅ Changed from `username` to `email` (since Devise uses email)
    password,
    error,
    setEmail, // ✅ Changed `setUsername` to `setEmail`
    setPassword,
    setError,
  } = useLoginForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ✅ Add loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password); // ✅ Call API

      if (data.token) {
        localStorage.setItem("authToken", data.token); // Store JWT token
        navigate("/dashboard"); // ✅ Redirect after login
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
      <form onSubmit={handleLogin} className="login-form">
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
      <p className="register-link">
        Don't have an account?{" "}
        <button onClick={handleRegister} className="register-button">
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
