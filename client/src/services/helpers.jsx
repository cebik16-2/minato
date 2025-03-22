import { logoutUser } from "../utils/auth";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

export const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      console.warn("Unauthorized! Logging out...");
      logoutUser();
      throw new Error("Session expired. Please log in again.");
    }

    const errorMessage = await response.text();
    throw new Error(`Error ${response.status}: ${errorMessage}`);
  }
  return response.json();
};
