import { BASE_URL, handleResponse } from "./helpers";
import { getAuthToken } from "../utils/auth";

export const getCategories = async () => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/categories`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createCategory = async (categoryData) => {
  const token = getAuthToken();
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
