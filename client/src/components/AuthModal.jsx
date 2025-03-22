import React from "react";
import { Modal, Box, Tabs, Tab } from "@mui/material";
import Login from "../pages/login/Login";
import Register from "../pages/register/register";

const AuthModal = ({ isOpen, onClose, authTab, handleAuthTabChange, handleLogin }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Tabs value={authTab} onChange={handleAuthTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {authTab === 0 && <Login handleLogin={handleLogin} />}
        {authTab === 1 && <Register />}
      </Box>
    </Modal>
  );
};

export default AuthModal;
