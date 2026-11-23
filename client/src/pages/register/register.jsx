import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth";
import "../../styles/pages/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // The API needs password_confirmation; this form has one password field.
      await registerUser(email, password, password, username);

      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter an email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="register-error">{error}</p>}
        {successMessage && <p className="register-success">{successMessage}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
