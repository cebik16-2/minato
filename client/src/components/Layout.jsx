import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Modal, Box, Tabs, Tab } from "@mui/material";
import LogoutButton from "./LogoutButton";
import Login from "../pages/login/Login";
import Register from "../pages/register/register";
import "../styles/pages/layout.css";

const Layout = ({ children, isLoggedIn, handleLogin, handleLogout }) => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);

  const handleAddListing = useCallback(() => {
    if (!isLoggedIn) {
      alert("You must be logged in to add a listing.");
      navigate("/login");
      return;
    }
    navigate("/create-listing");
  }, [isLoggedIn, navigate]);

  const handleAuthClick = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const handleAuthTabChange = (event, newValue) => {
    setAuthTab(newValue);
  };

  return (
    <div className="layout">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Minato</Link>
          </Typography>
          <Button color="inherit" component={Link} to="/FeaturedListings">
            Favorites
          </Button>
          <Button color="inherit" onClick={handleAddListing}>
            Add Listing
          </Button>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/my-account">
                My Account
              </Button>
              <Button color="inherit" onClick={handleLogout}>
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
        onClose={() => setIsAuthModalOpen(false)}
        authTab={authTab}
        handleAuthTabChange={handleAuthTabChange}
        handleLogin={handleLogin}
      />
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, authTab, handleAuthTabChange, handleLogin }) => (
  <Modal open={isOpen} onClose={onClose}>
    <Box>
      <Tabs value={authTab} onChange={handleAuthTabChange} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      {authTab === 0 && <Login handleLogin={handleLogin} />}
      {authTab === 1 && <Register />}
    </Box>
  </Modal>
);

export default Layout;