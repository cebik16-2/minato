import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton"; // Assuming you have this component
import "../styles/pages/layout.css"; // Import CSS for styling

const Layout = ({ children, isLoggedIn, handleLogin, handleLogout }) => {
  const navigate = useNavigate();

  const handleAddListing = () => {
    if (!isLoggedIn) {
      alert("You must be logged in to add a listing.");
      navigate("/login");
      return;
    }
    navigate("/create-listing");
  };

  return (
    <div className="layout">
      {/* Header Section */}
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
            <button
              onClick={handleLogin}
              className="header-btn button-primary"
            >
              Login
            </button>
          )}
        </nav>
      </header>

      {/* Main Content Section */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
