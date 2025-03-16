import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Modal, Box } from "@mui/material";
import LogoutButton from "./LogoutButton";
import Login from "../pages/login/Login";
import Register from "../pages/register/register";
import "../styles/pages/layout.css";

const Layout = ({ children, isLoggedIn, handleLogin, handleLogout }) => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleAddListing = () => {
    if (!isLoggedIn) {
      alert("You must be logged in to add a listing.");
      navigate("/login");
      return;
    }
    navigate("/create-listing");
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
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
            <>
              <Button color="inherit" onClick={handleLoginClick}>
                Login
              </Button>
              <Button color="inherit" onClick={handleRegisterClick}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <main>{children}</main>

      <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <Box>
          <Login />
        </Box>
      </Modal>

      <Modal open={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}>
        <Box>
          <Register />
        </Box>
      </Modal>
    </div>
  );
};

export default Layout;