import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import "../styles/pages/listingForm.css"; // Form-specific styles
import "../styles/shared/buttons.css"; // Shared button styles

const ListingForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    images: [],
    ...initialData, // Prepopulate fields if editing
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="listing-form">
      <Typography variant="h4" gutterBottom>
        {initialData.title ? "Edit Listing" : "Add Listing"}
      </Typography>
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      <Box className="form-buttons" mt={2}>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ListingForm;