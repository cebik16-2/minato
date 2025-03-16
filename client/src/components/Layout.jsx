import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import Modal from "./Modal";
import Login from "../pages/login/Login";
import Register from "../pages/register/register";
import "../styles/pages/layout.css";

const Layout = ({ children, isLoggedIn, handleLogin, handleLogout }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <header className="layout-header">
        <div className="header-logo">
          <Link to="/">Minato</Link>
        </div>

        <nav className="header-nav">
          <Link to="/FeaturedListings" className="header-btn">
            Favorites
          </Link>
          <button
            className="header-btn button-primary"
            onClick={handleAddListing}
          >
            Add Listing
          </button>
          {isLoggedIn ? (
            <>
              <Link to="/my-account" className="header-btn">
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="header-btn button-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="header-btn button-primary"
              >
                Login
              </button>
              <button
                onClick={handleRegisterClick}
                className="header-btn button-primary"
              >
                Register
              </button>
            </>
          )}
        </nav>
      </header>

      <main>{children}</main>

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <Login />
      </Modal>

      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}>
        <Register />
      </Modal>
    </div>
  );
};

export default Layout;