const BASE_URL = "http://localhost:5000";

export const getListings = async () => {
  const response = await fetch(`${BASE_URL}/listings`);
  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }
  return await response.jsxon();
};

export const getCities = async () => {
  const response = await fetch(`${BASE_URL}/cities`);
  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }
  return await response.jsxon();
};

export const getFavorites = async () => {
  const response = await fetch(`${BASE_URL}/favorites`);
  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }
  return await response.jsxon();
};

export const addFavorite = async (id) => {
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Failed to add favorite");
  }
};

export const removeFavorite = async (id) => {
  const response = await fetch(`${BASE_URL}/favorites/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to remove favorite");
  }
};

export const addListing = async (listing) => {
  const response = await fetch(`${BASE_URL}/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listing),
  });
  if (!response.ok) {
    throw new Error("Failed to add listing");
  }
  return await response.jsxon();
};

export const updateListing = async (id, updatedData) => {
  const response = await fetch(`${BASE_URL}/listings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Failed to update listing");
  }
  return await response.jsxon();
};

export const deleteListing = async (id) => {
  const response = await fetch(`${BASE_URL}/listings/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete listing");
  }
};

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return await response.jsxon();
};