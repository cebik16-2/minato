// ✅ Get JWT token from localStorage
export const getAuthToken = () => localStorage.getItem("authToken");

// ✅ Save JWT token to localStorage
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

// ✅ Remove JWT token (logout)
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  window.location.href = "/login"; // Redirect to login
};

// ✅ Decode JWT token
export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Extract payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base64); // Base64 decode
    return JSON.parse(decodedPayload);
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

  console.log("🔐 Raw token from localStorage:", token);

  const decoded = decodeToken(token);
  console.log("📦 Decoded token payload:", decoded);

  const userId = decoded?.user_id || decoded?.sub || decoded?.id || null;
  console.log("🆔 Extracted user ID from token:", userId);

  return userId;
};
