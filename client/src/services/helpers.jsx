import { logoutUser } from "../utils/auth";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

export const handleResponse = async (response) => {
  const contentType = response.headers.get("Content-Type");

  if (!response.ok) {
    if (response.status === 401) {
      console.warn("Unauthorized! Logging out...");
      logoutUser();
      throw new Error("Session expired. Please log in again.");
    }

    let errorMessage = `Error ${response.status}`;

    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage += `: ${errorData.error || JSON.stringify(errorData)}`;
      } else {
        const text = await response.text();
        errorMessage += `: ${text.substring(0, 100)}...`; // truncate long HTML
      }
    } catch (e) {
      errorMessage += " (Could not parse error response)";
    }

    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  throw new Error("Unexpected response format: expected JSON.");
};
