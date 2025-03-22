import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { LISTING_DETAILS_MESSAGES } from "../constants/listingDetailsMessages";

const RelatedListings = ({ listings }) => {
  const navigate = useNavigate();

  const hasListings = listings.length > 0;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        {LISTING_DETAILS_MESSAGES.RELATED_TITLE || "Related Listings"}
      </Typography>

      {hasListings ? (
        <Grid container spacing={3}>
          {listings.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Price:</strong> ${item.price.toLocaleString()}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/listing/${item.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {LISTING_DETAILS_MESSAGES.NO_RELATED_LISTINGS}
        </Typography>
      )}
    </Box>
  );
};

export default RelatedListings;
