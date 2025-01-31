import React from "react";
import Listing from "./Listing"; // Assuming a reusable Listing component exists
//import "../../styles/components/ListingsGrid.css";
import "../styles/pages/ListingsGrid.css";

const ListingsGrid = ({ listings }) => {
  return (
    <div className="listings-grid">
      {listings.map((listing) => (
        <div key={listing.id} className="listing-card">
          <p>Listing ID: {listing.id}</p>
        </div>
      ))}
    </div>
  );
};

export default ListingsGrid;
