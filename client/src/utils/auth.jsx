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

// ✅ Decode JWT token (optional, useful for getting user info)
export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Get payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)); // Decode payload
  } catch (error) {
    console.error("Invalid JWT Token:", error);
    return null;
  }
};

// ✅ Get logged-in user ID from token (optional)
export const getUserIdFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded ? decoded.user_id : null; // Assuming your token payload has `user_id`
};
