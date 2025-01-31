import React from "react";

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
    <input
      type="text"
      className="search-input"
      placeholder="Search by title..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <label>
      Price Range:
      <input
        type="range"
        className="price-range-input"
        min="0"
        max="2000"
        value={priceRange[1]}
        onChange={(e) => setPriceRange([0, Number(e.target.value)])}
      />
      {` Up to $${priceRange[1]}`}
    </label>
    <label>
      Location:
      <select
        value={location}
        className="location-select"
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">All Locations</option>
        {cities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </label>
    <label>
      Sort By:
      <select
        value={sortOption}
        className="sort-select"
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="">None</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
        <option value="titleAsc">Title: A-Z</option>
        <option value="titleDesc">Title: Z-A</option>
      </select>
    </label>
  </div>
);

export default React.memo(FilterBar);
