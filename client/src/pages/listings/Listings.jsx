import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
import Listing from "../../components/Listing";
import FilterBar from "../../components/shared/FilterBar";
import Pagination from "../../components/shared/Pagination";
import useListings from "../../hooks/useListings";
import usePagination from "../../hooks/usePagination";
import { filterAndSortListings } from "../../utils/filterAndSortListings";
import { LISTINGS_MESSAGES } from "../../constants/listingsMessages";
import { postFavorite, deleteFavorite } from "../../services/listings";
import "../../styles/pages/listings.css"; // Page-specific styles
import "../../styles/shared/buttons.css"; // Shared button styles

const PRICE_MIN = 0;
const PRICE_FALLBACK_MAX = 10000;

const Listings = () => {
  const { listings, cities, favorites, setFavorites, loading, error } =
    useListings(); // Removed unused `setListings`
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_FALLBACK_MAX]);
  const [location, setLocation] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Slider bounds come from the data, so the default range is never wider
  // than the slider.
  const priceMax = useMemo(() => {
    const prices = listings
      .map((listing) => Number(listing.price))
      .filter((price) => Number.isFinite(price));
    const maxPrice = prices.length
      ? Math.ceil(Math.max(...prices) / 100) * 100
      : 0;
    return Math.max(maxPrice, PRICE_FALLBACK_MAX);
  }, [listings]);

  // Widen the default range when the loaded data is priced above it.
  useEffect(() => {
    setPriceRange((prev) => (prev[1] >= priceMax ? prev : [prev[0], priceMax]));
  }, [priceMax]);

  // Apply filters and sorting
  const sortedListings = useMemo(
    () =>
      filterAndSortListings(listings, {
        searchQuery,
        priceRange,
        location,
        sortOption,
      }),
    [listings, searchQuery, priceRange, location, sortOption]
  );

  // Paginate the filtered listings, not the raw list.
  const itemsPerPage = 3;
  const { currentPage, setCurrentPage, totalPages, currentItems } = usePagination(
    itemsPerPage,
    sortedListings.length
  );

  // Any filter change starts again on page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, location, sortOption, setCurrentPage]);

  const currentListings = currentItems(sortedListings);

  // Toggle favorites: update the UI first, then tell the API.
  const toggleFavorite = async (id) => {
    const isFavorite = favorites.includes(id);
    setFavorites((prev) =>
      isFavorite ? prev.filter((favId) => favId !== id) : [...prev, id]
    );

    try {
      if (isFavorite) {
        await deleteFavorite(id);
      } else {
        await postFavorite(id);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      // Roll the optimistic change back.
      setFavorites((prev) =>
        isFavorite ? [...prev, id] : prev.filter((favId) => favId !== id)
      );
    }
  };

  return (
    <div className="listings-page">
      <h1>Listings</h1>

      {/* Filter Bar */}
      <FilterBar
        cities={cities}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        priceMin={PRICE_MIN}
        priceMax={priceMax}
        location={location}
        setLocation={setLocation}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Listings Container */}
      <div className="listings-container">
        {loading ? (
          <CircularProgress aria-label="Loading listings" />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : currentListings.length > 0 ? (
          currentListings.map((listing) => (
            <Listing
              key={listing.id}
              {...listing}
              isFavorite={favorites.includes(listing.id)}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <p className="empty-listings">{LISTINGS_MESSAGES.NO_LISTINGS_FOUND}</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Listings;
