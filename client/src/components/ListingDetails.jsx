import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListings } from "../services/api";
import "../styles/components/ListingsGrid.css"; // Verify `ListingsGrid.css` exists


const ListingDetails = () => {
  const { id } = useParams(); // Get the listing ID from the URL
  const [listing, setListing] = useState(null);
  const [relatedListings, setRelatedListings] = useState([]); // To store related listings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listings = await getListings();
        const foundListing = listings.find((item) => item.id === id); // Compare as strings
        if (foundListing) {
          setListing(foundListing);
          // Find related listings
          const related = listings.filter(
            (item) =>
              item.category === foundListing.category && item.id !== id
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="listing-details">
      <h2>{listing.title}</h2>
      <p>
        <strong>Price:</strong> ${listing.price}
      </p>
      <p>
        <strong>Location:</strong> {listing.location}
      </p>
      <p>
        <strong>Description:</strong> {listing.description}
      </p>
      <h3>Images</h3>
      <div className="images-container">
        {listing.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${listing.title} ${index + 1}`}
            className="listing-image"
          />
        ))}
      </div>
      <button className="back-button" onClick={() => window.history.back()}>
        Back to Listings
      </button>
      <h3>Related Listings</h3>
      <div className="related-listings">
        {relatedListings.length > 0 ? (
          relatedListings.map((related) => (
            <div className="related-card" key={related.id}>
              <h4>{related.title}</h4>
              <p>
                <strong>Price:</strong> ${related.price}
              </p>
              <button
                className="view-details-button"
                onClick={() => (window.location.href = `/listing/${related.id}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p>No related listings found.</p>
        )}
      </div>
    </div>
  );
};

export default ListingDetails;
