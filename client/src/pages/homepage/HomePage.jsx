import React, { useEffect, useState } from "react";
import HeroSection from "../../components/HeroSection";
import FeaturedListings from "../featuredlistings/FeaturedListings";
import { getListings } from "../../services/api";
import "../../styles/pages/HomePage.css";

const HomePage = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const listings = await getListings();
        // Assuming featured listings are tagged in the API response
        const featured = listings.filter((listing) => listing.isFeatured);
        setFeaturedListings(featured);
      } catch (error) {
        console.error("Error fetching featured listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, []);

  return (
    <div className="homepage">
      <HeroSection />
      {loading ? (
        <p>Loading featured listings...</p>
      ) : (
        <FeaturedListings listings={featuredListings} />
      )}
    </div>
  );
};

export default HomePage;
