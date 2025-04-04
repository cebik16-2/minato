import React, { useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Modal,
  Box,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/register";
import { useAuth } from "../context/AuthContext"; // ✅ NEW
import "../styles/pages/layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userId,
    logout,
  } = useAuth(); // ✅ Use context for auth status and logout

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleAddListing = useCallback(() => {
    if (!userId) {
      setShowSnackbar(true);
      return;
    }
    navigate("/create-listing");
  }, [userId, navigate]);

  const handleAuthClick = () => setIsAuthModalOpen(true);
  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    setAuthTab(0);
  };
  const handleAuthTabChange = (_, newValue) => setAuthTab(newValue);
  const handleSnackbarClose = () => setShowSnackbar(false);

  return (
    <div className="layout">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Minato
            </Link>
          </Typography>

          <Button
            color={location.pathname === "/FeaturedListings" ? "secondary" : "inherit"}
            component={Link}
            to="/FeaturedListings"
          >
            Favorites
          </Button>

          <Button color="inherit" onClick={handleAddListing}>
            Add Listing
          </Button>

          {userId ? (
            <>
              <Button
                color={location.pathname === "/my-account" ? "secondary" : "inherit"}
                component={Link}
                to="/my-account"
              >
                My Account
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleAuthClick}>
              Login/Register
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <main>{children}</main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        authTab={authTab}
        handleAuthTabChange={handleAuthTabChange}
      />

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={handleSnackbarClose}>
          You must be logged in to add a listing.
        </Alert>
      </Snackbar>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, authTab, handleAuthTabChange }) => (
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
      {authTab === 0 && <Login />}
      {authTab === 1 && <Register />}
    </Box>
  </Modal>
);

export default Layout;
