import { getAuthToken, logoutUser, setAuthToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      console.warn("Unauthorized! Logging out...");
      logoutUser(); // ✅ Use imported logout function
      throw new Error("Session expired. Please log in again.");
    }

    const errorMessage = await response.text();
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }
  return response.json();
};

// ---------------- AUTH API ----------------

// User login - stores JWT token
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: { email, password } }),
    });

    const data = await handleResponse(response);

    if (data.token) {
      setAuthToken(data.token); // Store token using utils/auth.js function
    }

    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// ---------------- USERS API ----------------

// Fetch all users
export const getUsers = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Get a single user
export const getUser = async (id) => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// Update user data
export const updateUser = async (id, userData) => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

// Delete a user
export const deleteUser = async (id) => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// ---------------- PRODUCTS API ----------------

export const getUserProducts = async (userId) => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/users/${userId}/products`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const createUserProduct = async (userId, productData) => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/users/${userId}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  return handleResponse(response);
};

export const deleteUserProduct = async (userId, productId) => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/users/${userId}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// ---------------- CATEGORIES API ----------------

export const getCategories = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/categories`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const createCategory = async (categoryData) => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  return handleResponse(response);
};

// ---------------- LISTINGS API ----------------

export const getListings = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/listings`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const getCities = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/cities`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const getFavorites = async () => {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found.");

  const response = await fetch(`${BASE_URL}/favorites`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};
