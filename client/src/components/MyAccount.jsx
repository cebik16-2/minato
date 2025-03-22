import React from "react";
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
  Grid,
} from "@mui/material";

const MyAccount = ({ user, favorites = [], listings = [] }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

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
            You have no favorite listings yet.
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
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/edit-listing/${listing.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => console.log("Delete listing", listing.id)}
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
            You have no listings yet.
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
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default MyAccount;
