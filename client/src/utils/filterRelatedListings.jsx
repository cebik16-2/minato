export const filterRelatedListings = (listings, currentListing) => {
    return listings.filter(
      (item) =>
        item.location === currentListing.location && item.id !== currentListing.id
    );
  };
  