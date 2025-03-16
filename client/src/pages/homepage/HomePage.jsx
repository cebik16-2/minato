import React, { useEffect, useState } from "react";
import HeroSection from "../../components/HeroSection";
import FeaturedListings from "../featuredlistings/FeaturedListings";
import { getListings } from "../../services/api";
import { CircularProgress, Box, Typography } from "@mui/material";
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
    <Box className="homepage">
      <HeroSection />
      {loading ? (
        <CircularProgress />
      ) : (
        <FeaturedListings listings={featuredListings} />
      )}
    </Box>
  );
};

export default HomePage;