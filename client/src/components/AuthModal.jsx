import React, { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Tabs, Tab, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Login = lazy(() => import("../pages/login/Login"));
const Register = lazy(() => import("../pages/register/register"));

const styles = {
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    color: "grey.600",
  },
};

const AuthModal = ({ isOpen, onClose, authTab, handleAuthTabChange, handleLogin }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <Box sx={styles.modalBox}>
        <IconButton onClick={onClose} sx={styles.closeButton} aria-label="Close modal">
          <CloseIcon />
        </IconButton>
        <Tabs value={authTab} onChange={handleAuthTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <Suspense fallback={<CircularProgress />}>
          {authTab === 0 && <Login handleLogin={handleLogin} />}
          {authTab === 1 && <Register />}
        </Suspense>
      </Box>
    </Modal>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  authTab: PropTypes.number.isRequired,
  handleAuthTabChange: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
};

export default AuthModal;
