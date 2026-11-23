import { BASE_URL, handleResponse } from "./helpers";
import { getAuthToken } from "../utils/auth";

export const getListings = async () => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/listings`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await handleResponse(response);
  if (Array.isArray(data)) return data;
  if (data?.listings && Array.isArray(data.listings)) return data.listings;

  console.warn("Unexpected listings format:", data);
  return [];
};

export const getCities = async () => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/cities`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getFavorites = async () => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/favorites`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  return handleResponse(response);
};

// The backend answers 204 No Content, which handleResponse rejects as
// "not JSON", so accept that status here.
const favoriteResponse = async (response) =>
  response.status === 204 ? null : handleResponse(response);

export const postFavorite = async (listingId) => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ favorite: { listing_id: listingId } }),
  });
  return favoriteResponse(response);
};

export const deleteFavorite = async (listingId) => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/favorites/${listingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return favoriteResponse(response);
};
