import React from "react";
import { HOMEPAGE_MESSAGES } from "../constants/homepageMessages";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import "../styles/pages/HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box className="hero-section" textAlign="center" py={5}>
      <Typography variant="h2" component="h1" gutterBottom>
        {HOMEPAGE_MESSAGES.HERO_TITLE}
      </Typography>
      <Typography variant="h5" component="p" gutterBottom>
        {HOMEPAGE_MESSAGES.HERO_SUBTITLE}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/listings")}>
        {HOMEPAGE_MESSAGES.CTA_BUTTON}
      </Button>
    </Box>
  );
};

export default HeroSection;
