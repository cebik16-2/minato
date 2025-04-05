import React from "react";
import PropTypes from "prop-types";
import { Modal as MuiModal, Box, IconButton, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Modal = ({ isOpen, onClose, children, title, description }) => {
  const modalId = "custom-modal";
  const descriptionId = "custom-modal-description";

  return (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      aria-labelledby={title ? modalId : undefined}
      aria-describedby={description ? descriptionId : undefined}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        {title && (
          <Typography id={modalId} variant="h6" component="h2" sx={{ mb: 2 }}>
            {title}
          </Typography>
        )}
        {description && (
          <Typography id={descriptionId} variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
        )}
        <Tooltip title="Close">
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.600",
            }}
            aria-label="Close modal"
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
        {children}
      </Box>
    </MuiModal>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

Modal.defaultProps = {
  title: null,
  description: null,
};

export default Modal;