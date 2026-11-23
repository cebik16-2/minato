import React, { useState, useCallback, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal"; // Extracted AuthModal
import { useAuth } from "../context/AuthContext";
import "../styles/pages/layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, logout } = useAuth();

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

  // A successful login closes the auth modal.
  useEffect(() => {
    if (userId && isAuthModalOpen) setIsAuthModalOpen(false);
  }, [userId, isAuthModalOpen]);

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
            color={location.pathname === "/featuredlistings" ? "secondary" : "inherit"}
            component={Link}
            to="/featuredlistings"
            aria-label="View Favorites"
          >
            Favorites
          </Button>

          <Button
            color="inherit"
            onClick={handleAddListing}
            aria-label="Add a new listing"
          >
            Add Listing
          </Button>

          {userId ? (
            <>
              {/* App.jsx routes no account page (pages/myaccount/MyAccount.jsx
                  is not wired up), so this points at the closest real route. */}
              <Button
                color={location.pathname === "/listings" ? "secondary" : "inherit"}
                component={Link}
                to="/listings"
                aria-label="Go to My Account"
              >
                My Account
              </Button>
              <Button color="inherit" onClick={logout} aria-label="Logout">
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={handleAuthClick}
              aria-label="Login or Register"
            >
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

export default Layout;
