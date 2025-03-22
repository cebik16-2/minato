import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  IconButton,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
        />

        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          fullWidth
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
                />
                <IconButton
                  color="error"
                  onClick={() => handleRemoveImage(index)}
                  aria-label="Remove image"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button onClick={handleAddImage} variant="outlined" size="small">
              + Add Image
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ListingForm;
