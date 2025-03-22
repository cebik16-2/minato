import React from "react";
import { HOMEPAGE_MESSAGES } from "../constants/homepageMessages";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        textAlign: "center",
        background: "linear-gradient(to right, #f0f4ff, #ffffff)", // Optional
        borderRadius: 3,
        boxShadow: 2,
        mt: 4,
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: { xs: "2rem", md: "3rem" } }}
        >
          {HOMEPAGE_MESSAGES.HERO_TITLE}
        </Typography>

        <Typography
          variant="h5"
          component="p"
          gutterBottom
          sx={{ color: "text.secondary", maxWidth: "700px" }}
        >
          {HOMEPAGE_MESSAGES.HERO_SUBTITLE}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/listings")}
        >
          {HOMEPAGE_MESSAGES.CTA_BUTTON}
        </Button>
      </Stack>
    </Box>
  );
};

export default HeroSection;
