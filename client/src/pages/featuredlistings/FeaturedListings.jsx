import ListingsGrid from "../../components/ListingsGrid";
import { HOMEPAGE_MESSAGES } from "../../constants/homepageMessages";
import "../../styles/pages/FeaturedListings.css";

const FeaturedListings = ({ listings = [] }) => { // Default to an empty array
  return (
    <div className="featured-listings">
      <h2>{HOMEPAGE_MESSAGES.FEATURED_SECTION_TITLE}</h2>
      {listings.length > 0 ? (
        <ListingsGrid listings={listings} />
      ) : (
        <p>No favorite listings available.</p>
      )}
    </div>
  );
};

export default FeaturedListings;
