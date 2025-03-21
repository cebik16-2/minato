export const filterAndSortListings = (listings, filters) => {
  const { searchQuery, priceRange, location, sortOption } = filters;

  const safeListings = Array.isArray(listings) ? listings : []; // ✅ safeguard

  // Filter listings
  const filteredListings = safeListings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      listing.price >= priceRange[0] &&
      listing.price <= priceRange[1] &&
      (location === "" || listing.location === location)
  );

  // Sort listings
  return filteredListings.sort((a, b) => {
    switch (sortOption) {
      case "priceLowToHigh":
        return a.price - b.price;
      case "priceHighToLow":
        return b.price - a.price;
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
};
