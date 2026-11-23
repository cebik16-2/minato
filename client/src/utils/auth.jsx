// ✅ localStorage key that holds the JWT token
export const AUTH_TOKEN_KEY = "***";

// Fires when the stored token changes in this tab. localStorage does not
// fire the "storage" event in the tab that made the change.
export const AUTH_TOKEN_EVENT = "auth:toke…ange";

const notifyTokenChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
  }
};

// ✅ Get JWT token from localStorage
export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

// ✅ Save JWT token to localStorage
export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  notifyTokenChange();
};

// ✅ Remove JWT token (logout). AuthContext owns the state and the redirect.
export const logoutUser = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  notifyTokenChange();
};

// ✅ Decode JWT token
export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Extract payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64)); // Base64 decode

    // Reject an expired token, so a stored token is not replayed after it dies.
    if (decodedPayload && decodedPayload.exp !== undefined) {
      const expiresAt = Number(decodedPayload.exp) * 1000; // exp is in seconds
      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        console.warn("❌ Token is expired; ignoring it.");
        return null;
      }
    }

    return decodedPayload;
  } catch (error) {
    console.error("❌ Invalid JWT token:", error);
    return null;
  }
};

// ✅ Get logged-in user ID from token
export const getUserIdFromToken = () => {
  const token = getAuthToken();

  if (!token) {
    console.warn("⚠️ No authToken found in localStorage");
    return null;
  }

  const decoded = decodeToken(token);

  return decoded?.user_id || decoded?.sub || decoded?.id || null;
};
