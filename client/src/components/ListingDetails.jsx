import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListings } from "../services/api";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import "../styles/components/ListingsGrid.css"; // Verify `ListingsGrid.css` exists

const ListingDetails = () => {
  const { id } = useParams(); // Get the listing ID from the URL
  const [listing, setListing] = useState(null);
  const [relatedListings, setRelatedListings] = useState([]); // To store related listings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listings = await getListings();
        const foundListing = listings.find((item) => item.id === id); // Compare as strings
        if (foundListing) {
          setListing(foundListing);
          // Find related listings
          const related = listings.filter(
            (item) =>
              item.category === foundListing.category && item.id !== id
          );
          setRelatedListings(related);
        } else {
          setError("Listing not found");
        }
      } catch (err) {
        setError("Error fetching listing details");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className="listing-details">
      <Typography variant="h4" gutterBottom>{listing.title}</Typography>
      <Typography variant="body1"><strong>Price:</strong> ${listing.price}</Typography>
      <Typography variant="body1"><strong>Location:</strong> {listing.location}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {listing.description}</Typography>
      <Typography variant="h5" gutterBottom>Images</Typography>
      <Box className="images-container">
        {listing.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${listing.title} ${index + 1}`}
            className="listing-image"
          />
        ))}
      </Box>
      <Button variant="contained" color="primary" onClick={() => window.history.back()}>
        Back to Listings
      </Button>
      <Typography variant="h5" gutterBottom>Related Listings</Typography>
      <Box className="related-listings">
        {relatedListings.length > 0 ? (
          relatedListings.map((related) => (
            <Box className="related-card" key={related.id}>
              <Typography variant="h6">{related.title}</Typography>
              <Typography variant="body1"><strong>Price:</strong> ${related.price}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => (window.location.href = `/listing/${related.id}`)}
              >
                View Details
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No related listings found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ListingDetails;
