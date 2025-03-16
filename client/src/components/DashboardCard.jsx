import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Button } from "@mui/material";

const DashboardCard = ({ title, description, buttonText, onClick }) => {
  return (
    <Card className="dashboard-card">
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Button variant="contained" color="primary" onClick={onClick}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DashboardCard;