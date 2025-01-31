import React from "react";
import { useNavigate } from "react-router-dom";
import { LISTING_DETAILS_MESSAGES } from "../constants/listingDetailsMessages";

const RelatedListings = ({ listings }) => {
  const navigate = useNavigate();

  return (
    <div className="related-listings">
      {listings.length > 0 ? (
        listings.map((item) => (
          <div key={item.id} className="related-listing-card">
            <h4>{item.title}</h4>
            <p><strong>Price:</strong> ${item.price}</p>
            <button
              onClick={() => navigate(`/listing/${item.id}`)}
              className="view-details-button"
            >
              View Details
            </button>
          </div>
        ))
      ) : (
        <p>{LISTING_DETAILS_MESSAGES.NO_RELATED_LISTINGS}</p>
      )}
    </div>
  );
};

export default RelatedListings;
