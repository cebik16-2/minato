import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import "../styles/pages/myAccount.css";

const MyAccount = ({ user, favorites, listings }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (e.g., remove token, reset state)
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <Box className="my-account-page" p={3}>
      <Typography variant="h4" gutterBottom>Welcome, {user.name}!</Typography>

      {/* Profile Section */}
      <Box className="profile-section" mb={3}>
        <Typography variant="h5">Profile</Typography>
        <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/edit-profile")}>
          Edit Profile
        </Button>
      </Box>

      {/* Favorites Section */}
      <Box className="favorites-section" mb={3}>
        <Typography variant="h5">Your Favorites</Typography>
        {favorites.length > 0 ? (
          <List>
            {favorites.map((fav) => (
              <ListItem key={fav.id}>
                <ListItemText primary={fav.title} />
                <Button variant="contained" color="primary" onClick={() => navigate(`/listing/${fav.id}`)}>
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>You have no favorite listings yet.</Typography>
        )}
      </Box>

      {/* Listings Management */}
      <Box className="listings-section" mb={3}>
        <Typography variant="h5">Your Listings</Typography>
        {listings.length > 0 ? (
          <List>
            {listings.map((listing) => (
              <ListItem key={listing.id}>
                <ListItemText primary={listing.title} />
                <Button variant="contained" color="primary" onClick={() => navigate(`/listing/${listing.id}`)}>
                  View
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate(`/edit-listing/${listing.id}`)}>
                  Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => console.log("Delete listing", listing.id)}>
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>You have no listings yet.</Typography>
        )}
      </Box>

      {/* Logout Button */}
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default MyAccount;