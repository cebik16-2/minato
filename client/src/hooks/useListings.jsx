import { useState, useEffect } from "react";
import { getListings, getCities, getFavorites } from "../services/api";
import { getAuthToken } from "../utils/auth";

// A list endpoint may answer with an array or with { <key>: [...] }.
const toList = (data, key) =>
  Array.isArray(data) ? data : data?.[key] || [];

// /favorites returns favorite records; the UI compares listing ids.
const toFavoriteIds = (data) =>
  toList(data, "favorites").map((fav) =>
    fav && typeof fav === "object" ? fav.listing_id ?? fav.id : fav
  );

const useListings = () => {
  const [listings, setListings] = useState([]);
  const [cities, setCities] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Anonymous visitors have no token, and /favorites answers 401 for them.
      // allSettled keeps a failed side request from hiding the listings.
      const requests = [getListings(), getCities()];
      if (getAuthToken()) requests.push(getFavorites());

      const [listingsResult, citiesResult, favoritesResult] =
        await Promise.allSettled(requests);

      if (listingsResult.status === "fulfilled") {
        setListings(toList(listingsResult.value, "listings"));
      } else {
        console.error("Error fetching listings:", listingsResult.reason);
        setError("Could not load listings. Please try again.");
      }

      if (citiesResult.status === "fulfilled") {
        setCities(toList(citiesResult.value, "cities"));
      } else {
        console.error("Error fetching cities:", citiesResult.reason);
      }

      if (favoritesResult) {
        if (favoritesResult.status === "fulfilled") {
          setFavorites(toFavoriteIds(favoritesResult.value));
        } else {
          console.error(
            "Error fetching favorites:",
            favoritesResult.reason
          );
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    listings,
    setListings,
    cities,
    favorites,
    setFavorites,
    loading,
    error,
  };
};

export default useListings;


