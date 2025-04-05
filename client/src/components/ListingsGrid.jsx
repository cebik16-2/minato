import React from "react";
import PropTypes from "prop-types";
import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import Listing from "./Listing";

const ListingsGrid = ({
  listings = [],
  loading = false,
  error = null,
  emptyMessage = "No listings available.",
}) => {
  const hasListings = listings.length > 0;

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 4 } }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="h6" align="center" color="error" sx={{ mt: 5 }}>
          {error}
        </Typography>
      ) : hasListings ? (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <Grid item key={listing.id} xs={12} sm={6} md={4}>
              <Listing {...listing} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 5 }}>
          {emptyMessage}
        </Typography>
      )}
    </Box>
  );
};

ListingsGrid.propTypes = {
  listings: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
};

ListingsGrid.defaultProps = {
  listings: [],
  loading: false,
  error: null,
  emptyMessage: "No listings available.",
};

export default ListingsGrid;