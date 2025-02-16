import { useState } from "react";
import { loginUser } from "../services/api";

const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser(email, password); // Call API
      localStorage.setItem("authToken", response.token); // Store JWT token
      window.location.href = "/dashboard"; // Redirect after login
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    setError,
    resetForm,
    handleLogin,
  };
};

export default useLoginForm;
