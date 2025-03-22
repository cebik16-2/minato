import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import Listing from "./Listing";

const ListingsGrid = ({ listings = [] }) => {
  const hasListings = listings.length > 0;

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 4 } }}>
      {hasListings ? (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item key={listing.id} xs={12} sm={6} md={4}>
              <Listing {...listing} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 5 }}>
          No listings available.
        </Typography>
      )}
    </Box>
  );
};

export default ListingsGrid;
