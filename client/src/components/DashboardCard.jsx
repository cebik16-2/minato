import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const DashboardCard = ({ title, description, buttonText, onClick }) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" component="div" fontWeight="bold">
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          {buttonText && onClick && (
            <Button variant="contained" color="primary" onClick={onClick}>
              {buttonText}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
};

export default DashboardCard;
