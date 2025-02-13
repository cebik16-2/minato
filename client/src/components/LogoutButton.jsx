import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login"); // Redirect to login page
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "10px 20px",
        backgroundColor: "#DC3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
