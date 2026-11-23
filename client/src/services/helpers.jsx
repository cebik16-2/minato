import { getAuthToken, logoutUser } from "../utils/auth";

// ✅ Base API URL. VITE_API_URL is required. The localhost fallback is a dev
// convenience only: a production build must not point at a developer machine.
const DEV_FALLBACK_URL = "http://127.0.0.1:3000";

const resolveBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (url) return url;
  if (import.meta.env.DEV) return DEV_FALLBACK_URL;
  console.error(
    "VITE_API_URL is not set. Every API call will fail. Set VITE_API_URL and rebuild the client."
  );
  return "";
};

export const BASE_URL = resolveBaseUrl();

// ✅ Inject Authorization header if token is available
export const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Common response handler with logout on 401
export const handleResponse = async (response) => {
  const contentType = response.headers.get("Content-Type");

  if (!response.ok) {
    if (response.status === 401) {
      console.warn("🚫 Unauthorized! Logging out...");
      logoutUser();
      throw new Error("Session expired. Please log in again.");
    }

    let errorMessage = `❌ Error ${response.status}`;

    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage += `: ${errorData.error || JSON.stringify(errorData)}`;
      } else {
        const text = await response.text();
        errorMessage += `: ${text.substring(0, 100)}...`;
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
