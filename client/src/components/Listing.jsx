import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Stack,
  Box,
  Chip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Listing = ({
  id,
  title,
  price,
  location,
  isFavorite = false,
  toggleFavorite,
  imageUrl = "",
  isNew = false,
  isFeatured = false,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: 3,
        boxShadow: 3,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
        },
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Listing Image */}
      {imageUrl && (
        <CardMedia
          component="img"
          height="180"
          image={imageUrl}
          alt={`Image of ${title}`}
        />
      )}

      {/* Badges */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          display: "flex",
          gap: 1,
        }}
      >
        {isNew && <Chip label="New" color="success" size="small" />}
        {isFeatured && <Chip label="Featured" color="warning" size="small" />}
      </Box>

      {/* Favorite Button */}
      <IconButton
        onClick={() => toggleFavorite(id)}
        color="primary"
        sx={{ position: "absolute", top: 8, right: 8 }}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1.5}>
          <Typography
            variant="h6"
            fontWeight="bold"
            noWrap
            title={title}
          >
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Price:</strong> ${price.toLocaleString()}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Location:</strong> {location}
          </Typography>

          <Box sx={{ mt: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/listing/${id}`)}
              fullWidth
              aria-label={`View details of ${title}`}
            >
              View Details
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

Listing.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool,
  toggleFavorite: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  isNew: PropTypes.bool,
  isFeatured: PropTypes.bool,
};

export default Listing;