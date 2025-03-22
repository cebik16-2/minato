import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListings } from "../services";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

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
        const listings = await getListings();
        const foundListing = listings.find((item) => item.id.toString() === id);

        if (foundListing) {
          setListing(foundListing);

          const related = listings.filter(
            (item) =>
              item.category === foundListing.category &&
              item.id.toString() !== id
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

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 5 } }}>
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
        <strong>Description:</strong> {listing.description}
      </Typography>

      {/* Images */}
      <Typography variant="h5" gutterBottom>
        Images
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {listing.images?.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={`${listing.title} ${index + 1}`}
                sx={{ objectFit: "cover" }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mb: 5 }}>
        Back to Listings
      </Button>

      {/* Related Listings */}
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
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No related listings found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ListingDetails;
