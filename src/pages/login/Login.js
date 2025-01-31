import React from "react";
import { useNavigate } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import useLoginForm from "../../hooks/useLoginForm";
import { LOGIN_MESSAGES, PLACEHOLDERS } from "../../constants/messages";
import "../../styles/pages/Login.css";


const Login = () => {
  const { users } = useUsers();
  const {
    username,
    password,
    error,
    setUsername,
    setPassword,
    setError,
  } = useLoginForm();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      navigate("/"); // Redirect to the listings page
    } else {
      setError(LOGIN_MESSAGES.INVALID_CREDENTIALS);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder={PLACEHOLDERS.USERNAME}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
