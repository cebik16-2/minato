import { useState, useEffect } from "react";
import { getListings } from "../services/api";

const useListingDetails = (id) => {
  const [listing, setListing] = useState(null);
  const [relatedListings, setRelatedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listings = await getListings();
        const foundListing = listings.find((item) => item.id === id);
        if (foundListing) {
          setListing(foundListing);

          const related = listings.filter(
            (item) =>
              item.location === foundListing.location && item.id !== foundListing.id
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

  return { listing, relatedListings, loading, error };
};

export default useListingDetails;
