import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { createUserProduct } from '../../services';
import { getUserIdFromToken } from '../../utils/auth';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        const data = await res.json();

        let fetchedCategories = [];

        if (Array.isArray(data)) {
          fetchedCategories = data;
        } else if (Array.isArray(data.categories)) {
          fetchedCategories = data.categories;
        } else {
          console.warn("❌ Unexpected category format:", data);
        }

        setCategories(fetchedCategories);
      } catch (err) {
        console.error('❌ Failed to fetch categories:', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const userId = getUserIdFromToken();
    const newListing = {
      title,
      price: Number(price),
      description,
      category_id: Number(categoryId),
    };
    console.log("💥 userId before createUserProduct:", userId);

    try {
      await createUserProduct(userId, newListing);
      setSuccess('Listing created successfully!');
      setTitle('');
      setPrice('');
      setDescription('');
      setCategoryId('');
    } catch (err) {
      setError(err.message || 'Failed to create listing. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Create Listing
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <TextField
          select
          label="Category"
          fullWidth
          margin="normal"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name || `Category ${category.id}`}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Loading categories...</MenuItem>
          )}
        </TextField>

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Listing'}
          </Button>
        </Box>
      </form>

      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default CreateListing;
