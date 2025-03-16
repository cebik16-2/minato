import React from "react";
import PropTypes from "prop-types";
import { Modal as MuiModal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/components/Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <MuiModal open={isOpen} onClose={onClose}>
      <Box className="modal-content">
        <IconButton className="modal-close" onClick={onClose}>
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