import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login"); // Redirect to login page
  };

  return (
    <Button
      onClick={handleLogout}
      variant="contained"
      color="secondary"
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;