import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/myAccount.css";

const MyAccount = ({ user, favorites, listings }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (e.g., remove token, reset state)
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <div className="my-account-page">
      <h1>Welcome, {user.name}!</h1>

      {/* Profile Section */}
      <div className="profile-section">
        <h2>Profile</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
      </div>

      {/* Favorites Section */}
      <div className="favorites-section">
        <h2>Your Favorites</h2>
        {favorites.length > 0 ? (
          <ul>
            {favorites.map((fav) => (
              <li key={fav.id}>
                {fav.title} - <button onClick={() => navigate(`/listing/${fav.id}`)}>View</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no favorite listings yet.</p>
        )}
      </div>

      {/* Listings Management */}
      <div className="listings-section">
        <h2>Your Listings</h2>
        {listings.length > 0 ? (
          <ul>
            {listings.map((listing) => (
              <li key={listing.id}>
                {listing.title} - 
                <button onClick={() => navigate(`/listing/${listing.id}`)}>View</button>
                <button onClick={() => navigate(`/edit-listing/${listing.id}`)}>Edit</button>
                <button onClick={() => console.log("Delete listing", listing.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no listings yet.</p>
        )}
      </div>

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default MyAccount;
