import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "../styles/pages/listing.css"; // Adjust the path as necessary

const Listing = ({ id, title, price, location, isFavorite, toggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <Card className="listing-card">
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Price: ${price}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {location}
        </Typography>
        <IconButton onClick={() => toggleFavorite(id)} color="primary">
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Button variant="contained" color="primary" onClick={() => navigate(`/listing/${id}`)}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default Listing;
