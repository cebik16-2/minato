import React from "react";
import { TextField, Slider, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const FilterBar = ({
  cities,
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  location,
  setLocation,
  sortOption,
  setSortOption,
}) => (
  <div className="filter-group">
    <TextField
      label="Search by title"
      variant="outlined"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      fullWidth
      margin="normal"
    />
    <FormControl fullWidth margin="normal">
      <InputLabel>Price Range</InputLabel>
      <Slider
        value={priceRange}
        onChange={(e, newValue) => setPriceRange(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={2000}
      />
    </FormControl>
    <FormControl fullWidth margin="normal">
      <InputLabel>Location</InputLabel>
      <Select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <MenuItem value="">All Locations</MenuItem>
        {cities.map((city) => (
          <MenuItem key={city.id} value={city.name}>
            {city.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl fullWidth margin="normal">
      <InputLabel>Sort By</InputLabel>
      <Select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
        <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
        <MenuItem value="titleAsc">Title: A-Z</MenuItem>
        <MenuItem value="titleDesc">Title: Z-A</MenuItem>
      </Select>
    </FormControl>
  </div>
);

export default React.memo(FilterBar);
