const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }
  return response.json(); // Fixed typo from response.jsxon() to response.json()
};

export const getListings = async () => {
  const response = await fetch(`${BASE_URL}/listings`);
  return handleResponse(response);
};

export const getCities = async () => {
  const response = await fetch(`${BASE_URL}/cities`);
  return handleResponse(response);
};

export const getFavorites = async () => {
  const response = await fetch(`${BASE_URL}/favorites`);
  return handleResponse(response);
};

export const addFavorite = async (id) => {
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  return handleResponse(response);
};

export const removeFavorite = async (id) => {
  const response = await fetch(`${BASE_URL}/favorites/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const addListing = async (listing) => {
  const response = await fetch(`${BASE_URL}/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listing),
  });
  return handleResponse(response);
};

export const updateListing = async (id, updatedData) => {
  const response = await fetch(`${BASE_URL}/listings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  return handleResponse(response);
};

export const deleteListing = async (id) => {
  const response = await fetch(`${BASE_URL}/listings/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  return handleResponse(response);
};

export const signUp = async (userData) => {
  const response = await fetch(`${BASE_URL}/users/sign_up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};
