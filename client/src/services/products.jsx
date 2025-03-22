import { BASE_URL, handleResponse } from "./helpers";
import { getAuthToken } from "../utils/auth";

export const getUserProducts = async (userId) => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/users/${userId}/products`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createUserProduct = async (userId, productData) => {
  const token = getAuthToken();
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
  const response = await fetch(`${BASE_URL}/users/${userId}/products/${productId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  return handleResponse(response);
};
