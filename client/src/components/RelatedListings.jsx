import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { LISTING_DETAILS_MESSAGES } from "../constants/listingDetailsMessages";

const RelatedListings = ({ listings }) => {
  const navigate = useNavigate();

  return (
    <Box className="related-listings" mt={3}>
      {listings.length > 0 ? (
        listings.map((item) => (
          <Card key={item.id} className="related-listing-card" variant="outlined" mb={2}>
            <CardContent>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body1"><strong>Price:</strong> ${item.price}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/listing/${item.id}`)}
                className="view-details-button"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>{LISTING_DETAILS_MESSAGES.NO_RELATED_LISTINGS}</Typography>
      )}
    </Box>
  );
};

export default RelatedListings;