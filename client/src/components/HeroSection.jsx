import React from "react";
import PropTypes from "prop-types";
import { HOMEPAGE_MESSAGES } from "../constants/homepageMessages";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";

const HeroSection = ({ title, subtitle, buttonText, background }) => {
  const navigate = useNavigate();

  const styles = {
    container: {
      py: { xs: 6, md: 10 },
      px: 2,
      textAlign: "center",
      background: background || "linear-gradient(to right, #f0f4ff, #ffffff)",
      borderRadius: 3,
      boxShadow: 2,
      mt: 4,
    },
    title: {
      fontWeight: "bold",
      fontSize: { xs: "2rem", md: "3rem" },
    },
    subtitle: {
      color: "text.secondary",
      maxWidth: "700px",
    },
  };

  return (
    <Box component="section" sx={styles.container}>
      <Stack spacing={3} alignItems="center">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={styles.title}
        >
          {title || HOMEPAGE_MESSAGES.HERO_TITLE}
        </Typography>

        <Typography
          variant="h5"
          component="p"
          gutterBottom
          sx={styles.subtitle}
        >
          {subtitle || HOMEPAGE_MESSAGES.HERO_SUBTITLE}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/listings")}
          aria-label={buttonText || HOMEPAGE_MESSAGES.CTA_BUTTON}
        >
          {buttonText || HOMEPAGE_MESSAGES.CTA_BUTTON}
        </Button>
      </Stack>
    </Box>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  buttonText: PropTypes.string,
  background: PropTypes.string,
};

HeroSection.defaultProps = {
  title: HOMEPAGE_MESSAGES.HERO_TITLE,
  subtitle: HOMEPAGE_MESSAGES.HERO_SUBTITLE,
  buttonText: HOMEPAGE_MESSAGES.CTA_BUTTON,
  background: "linear-gradient(to right, #f0f4ff, #ffffff)",
};

export default HeroSection;
