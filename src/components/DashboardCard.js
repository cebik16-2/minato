import React from "react";
import PropTypes from "prop-types";

const DashboardCard = ({ title, description, buttonText, onClick }) => {
  return (
    <div className="dashboard-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <button className="dashboard-button" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DashboardCard;