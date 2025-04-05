import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Divider,
} from "@mui/material";

const MyAccount = ({ user, favorites = [], listings = [] }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  if (!user) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 5 }}>
        User data is not available. Please log in again.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}!
      </Typography>

      {/* Profile Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/edit-profile")}
          aria-label="Edit profile"
        >
          Edit Profile
        </Button>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Favorites Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Your Favorites
        </Typography>

        {favorites.length > 0 ? (
          <List>
            {favorites.map((fav) => (
              <ListItem
                key={fav.id}
                secondaryAction={
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/listing/${fav.id}`)}
                    aria-label={`View details of ${fav.title}`}
                  >
                    View
                  </Button>
                }
              >
                <ListItemText primary={fav.title} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">
            You have no favorite listings yet. Start exploring to add some!
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Listings Management Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" gutterBottom>
          Your Listings
        </Typography>

        {listings.length > 0 ? (
          <List>
            {listings.map((listing) => (
              <ListItem
                key={listing.id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/listing/${listing.id}`)}
                      aria-label={`View details of ${listing.title}`}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/edit-listing/${listing.id}`)}
                      aria-label={`Edit ${listing.title}`}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => console.log("Delete listing", listing.id)}
                      aria-label={`Delete ${listing.title}`}
                    >
                      Delete
                    </Button>
                  </Stack>
                }
              >
                <ListItemText primary={listing.title} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">
            You have no listings yet. Create one to get started!
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Logout Button */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          size="large"
          aria-label="Logout"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

MyAccount.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  listings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
};

export default MyAccount;