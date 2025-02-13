import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useListingDetails from "../../hooks/useListingDetails";
import RelatedListings from "../../components/RelatedListings";
import { LISTING_DETAILS_MESSAGES } from "../../constants/listingDetailsMessages";
import "../../styles/pages/listingDetails.css";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listing, relatedListings, loading, error } = useListingDetails(id);

  if (loading) return <p>{LISTING_DETAILS_MESSAGES.LOADING}</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="listing-details">
      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        {LISTING_DETAILS_MESSAGES.BACK_BUTTON}
      </button>
      <h2>{listing.title}</h2>
      <p><strong>Price:</strong> ${listing.price}</p>
      <p><strong>Location:</strong> {listing.location}</p>
      <p><strong>Description:</strong> {listing.description || LISTING_DETAILS_MESSAGES.NO_DESCRIPTION}</p>
      <h3>Images</h3>
      <div className="images-container">
        {listing.images && listing.images.length > 0 ? (
          listing.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${listing.title} ${index + 1}`}
              className="listing-image"
            />
          ))
        ) : (
          <p>{LISTING_DETAILS_MESSAGES.NO_IMAGES}</p>
        )}
      </div>
      <h3>Contact Seller</h3>
      <p><strong>Name:</strong> {listing.sellerContact?.name || LISTING_DETAILS_MESSAGES.NO_CONTACT}</p>
      <p><strong>Email:</strong> {listing.sellerContact?.email || LISTING_DETAILS_MESSAGES.NO_CONTACT}</p>
      <p><strong>Phone:</strong> {listing.sellerContact?.phone || LISTING_DETAILS_MESSAGES.NO_CONTACT}</p>
      <h3>Related Listings</h3>
      <RelatedListings listings={relatedListings} />
    </div>
  );
};

export default ListingDetails;