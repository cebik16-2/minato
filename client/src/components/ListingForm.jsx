import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ListingForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    images: [],
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleAddImage = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price must be a positive number.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: { xs: 2, md: 4 },
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {initialData.title ? "Edit Listing" : "Add Listing"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.title}
          helperText={errors.title}
          aria-label="Listing title"
        />

        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.price}
          helperText={errors.price}
          aria-label="Listing price"
        />

        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.location}
          helperText={errors.location}
          aria-label="Listing location"
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={4}
          fullWidth
          aria-label="Listing description"
        />

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Image URLs
          </Typography>
          <Stack spacing={1}>
            {formData.images.map((img, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label={`Image ${index + 1}`}
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  fullWidth
                  sx={{ mr: 1 }}
                  aria-label={`Image URL ${index + 1}`}
                />
                <IconButton
                  color="error"
                  onClick={() => handleRemoveImage(index)}
                  aria-label={`Remove image ${index + 1}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              onClick={handleAddImage}
              variant="outlined"
              size="small"
              aria-label="Add new image"
            >
              + Add Image
            </Button>
          </Stack>
        </Box>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please fix the errors above before submitting.
          </Alert>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            aria-label="Save listing"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            aria-label="Cancel listing form"
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ListingForm;