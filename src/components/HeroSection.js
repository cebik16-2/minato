import React from "react";
import { HOMEPAGE_MESSAGES } from "../constants/homepageMessages";
import { useNavigate } from "react-router-dom";
import "../styles/pages/HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      <h1>{HOMEPAGE_MESSAGES.HERO_TITLE}</h1>
      <p>{HOMEPAGE_MESSAGES.HERO_SUBTITLE}</p>
      <button
        className="cta-button"
        onClick={() => navigate("/listings")}
      >
        {HOMEPAGE_MESSAGES.CTA_BUTTON}
      </button>
    </div>
  );
};

export default HeroSection;
