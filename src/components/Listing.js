import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/listing.css"; // Adjust the path as necessary

const Listing = ({ id, title, price, location, isFavorite, toggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="listing-card">
      <h3>{title}</h3>
      <p>
        <strong>Price: ${price}</strong>
      </p>
      <p>Location: {location}</p>
      <button
        className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
        onClick={() => toggleFavorite(id)}
      >
        ♥
      </button>
      <button
        className="details-button"
        onClick={() => navigate(`/listing/${id}`)}
      >
        View Details
      </button>
    </div>
  );
};

export default Listing;
