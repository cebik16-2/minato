import { BASE_URL, handleResponse } from "./helpers";
import { getAuthToken } from "../utils/auth";

export const getUsers = async () => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/users`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getUser = async (id) => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const updateUser = async (id, userData) => {
  const token = getAuthToken();
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

export const deleteUser = async (id) => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  return handleResponse(response);
};
