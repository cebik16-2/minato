import React from "react";
import PropTypes from "prop-types";
import { Modal as MuiModal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="custom-modal"
      aria-describedby="custom-modal-description"
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
        {children}
      </Box>
    </MuiModal>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
