import React from "react";
import Listing from "./Listing"; // Assuming a reusable Listing component exists
import { Grid } from "@mui/material";
import "../styles/pages/ListingsGrid.css";

const ListingsGrid = ({ listings }) => {
  return (
    <Grid container spacing={2} className="listings-grid">
      {listings.map((listing) => (
        <Grid item key={listing.id} xs={12} sm={6} md={4} className="listing-card">
          <Listing {...listing} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ListingsGrid;