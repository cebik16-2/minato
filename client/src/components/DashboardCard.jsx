import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const DashboardCard = ({ title, description, buttonText, onClick, icon: Icon, sx }) => {
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
        ...sx,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {Icon && <Icon fontSize="large" />}
            <Typography variant="h5" component="div" fontWeight="bold">
              {title}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          {buttonText && onClick && (
            <Button
              variant="contained"
              color="primary"
              onClick={onClick}
              aria-label={buttonText}
            >
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
  sx: PropTypes.object,
  icon: PropTypes.elementType,
};

DashboardCard.defaultProps = {
  buttonText: null,
  onClick: null,
  sx: {},
  icon: null,
};

export default DashboardCard;
