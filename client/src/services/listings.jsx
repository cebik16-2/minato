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
