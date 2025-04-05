import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { getListings } from "../services/listings";
import { LISTING_DETAILS_MESSAGES } from "../constants/listingDetailsMessages";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [relatedListings, setRelatedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const listings = await getListings();
        const foundListing = listings.find((item) => item.id.toString() === id);

        if (foundListing) {
          setListing(foundListing);
          const related = listings.filter(
            (item) => item.id !== foundListing.id && item.category === foundListing.category
          );
          setRelatedListings(related);
        } else {
          setError(LISTING_DETAILS_MESSAGES.LISTING_NOT_FOUND);
        }
      } catch (err) {
        setError(LISTING_DETAILS_MESSAGES.ERROR_FETCHING_LISTING);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{LISTING_DETAILS_MESSAGES.LOADING}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        {error}
      </Typography>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 } }}>
      {/* Listing Details */}
      <Typography variant="h4" gutterBottom>
        {listing.title}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>Price:</strong> ${listing.price.toLocaleString()}
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>Location:</strong> {listing.location}
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        <strong>Description:</strong> {listing.description || LISTING_DETAILS_MESSAGES.NO_DESCRIPTION}
      </Typography>

      {/* Images Section */}
      <Typography variant="h5" gutterBottom>
        Images
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {listing.images?.length > 0 ? (
          listing.images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  alt={`${listing.title} Image ${index + 1}`}
                  sx={{ objectFit: "cover" }}
                />
              </Card>
            </Grid>
          ))
        ) : (
          <Typography color="text.secondary">{LISTING_DETAILS_MESSAGES.NO_IMAGES}</Typography>
        )}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{ mb: 5 }}
        aria-label={LISTING_DETAILS_MESSAGES.BACK_BUTTON}
      >
        {LISTING_DETAILS_MESSAGES.BACK_BUTTON}
      </Button>

      {/* Related Listings Section */}
      <Typography variant="h5" gutterBottom>
        Related Listings
      </Typography>
      <Grid container spacing={3}>
        {relatedListings.length > 0 ? (
          relatedListings.map((related) => (
            <Grid item xs={12} sm={6} md={4} key={related.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {related.image && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={related.image}
                    alt={related.title}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>
                    {related.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Price:</strong> ${related.price.toLocaleString()}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/listing/${related.id}`)}
                    aria-label={`View details of ${related.title}`}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            {LISTING_DETAILS_MESSAGES.NO_RELATED_LISTINGS}
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ListingDetails;