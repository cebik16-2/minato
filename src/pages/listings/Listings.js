import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Listing from "../../components/Listing";
import FilterBar from "../../components/shared/FilterBar";
import Pagination from "../../components/shared/Pagination";
import useListings from "../../hooks/useListings";
import usePagination from "../../hooks/usePagination";
import { filterAndSortListings } from "../../utils/filterAndSortListings";
import { LISTINGS_MESSAGES } from "../../constants/listingsMessages";
import "../../styles/pages/listings.css"; // Page-specific styles
import "../../styles/shared/buttons.css"; // Shared button styles

const Listings = () => {
  const { listings, cities, favorites, setFavorites } = useListings(); // Removed unused `setListings`
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [location, setLocation] = useState("");
  const [sortOption, setSortOption] = useState("");

  const itemsPerPage = 3;
  const { currentPage, setCurrentPage, totalPages, currentItems } = usePagination(
    itemsPerPage,
    listings.length
  );

  // Apply filters and sorting
  const sortedListings = filterAndSortListings(listings, {
    searchQuery,
    priceRange,
    location,
    sortOption,
  });

  // Paginate the filtered listings
  const currentListings = currentItems(sortedListings);

  // Toggle favorites
  const toggleFavorite = (id) => {
    try {
      if (favorites.includes(id)) {
        setFavorites((prev) => prev.filter((favId) => favId !== id));
      } else {
        setFavorites((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
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
        location={location}
        setLocation={setLocation}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Listings Container */}
      <div className="listings-container">
        {currentListings.length > 0 ? (
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
