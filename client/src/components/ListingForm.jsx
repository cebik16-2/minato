import React, { useState } from "react";
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
    <form onSubmit={handleSubmit} className="listing-form">
      <h2>{initialData.title ? "Edit Listing" : "Add Listing"}</h2>
      <label className="form-label">
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="form-input"
        />
      </label>
      <label className="form-label">
        Price:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="form-input"
        />
      </label>
      <label className="form-label">
        Location:
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="form-input"
        />
      </label>
      <label className="form-label">
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="form-textarea"
        />
      </label>
      <div className="form-buttons">
        <button type="submit" className="button button-primary">
          Save
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ListingForm;
