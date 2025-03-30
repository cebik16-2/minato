import { BASE_URL, handleResponse } from "./helpers";
import { getAuthToken } from "../utils/auth";

// ✅ Fetch products for a specific user
export const getUserProducts = async (userId) => {
  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}/users/${userId}/products`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

// ✅ Create a new product (Rails expects { product: {} })
export const createUserProduct = async (userId, productData) => {
  const token = getAuthToken();

  // ⛔️ Do NOT include user_id — it's set via @user.products.new in the backend
  const wrappedProduct = {
    product: {
      ...productData,
    },
  };

  const response = await fetch(`${BASE_URL}/users/${userId}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(wrappedProduct),
  });

  return handleResponse(response);
};

// ✅ Delete a user's product
export const deleteUserProduct = async (userId, productId) => {
  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}/users/${userId}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};
