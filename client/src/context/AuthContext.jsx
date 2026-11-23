// src/context/AuthContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  AUTH_TOKEN_EVENT,
  AUTH_TOKEN_KEY,
  decodeToken,
  getAuthToken,
  logoutUser,
  setAuthToken,
} from "../utils/auth";

const AuthContext = createContext();

// A stored token that cannot be decoded (malformed or expired) is dropped,
// so an expired session is not replayed when the app boots.
const readStoredToken = () => {
  const stored = getAuthToken();
  if (!stored) return null;
  if (!decodeToken(stored)) {
    logoutUser();
    return null;
  }
  return stored;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(readStoredToken);
  const [userId, setUserId] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      const id = decoded?.user_id || decoded?.sub || decoded?.id || null;
      setUserId(id);
    } else {
      setUserId(null);
    }
  }, [token]);

  const login = (newToken) => {
    setAuthToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    logoutUser();
    setToken(null);
    setUserId(null);
  };

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  // Keep this tab in sync when another tab logs in or out, and when
  // handleResponse() drops the token after a 401.
  useEffect(() => {
    const syncToken = () => setToken(readStoredToken());
    const handleStorage = (event) => {
      // event.key is null when localStorage is cleared as a whole.
      if (event.key === null || event.key === AUTH_TOKEN_KEY) syncToken();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_TOKEN_EVENT, syncToken);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_TOKEN_EVENT, syncToken);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Access auth anywhere
export const useAuth = () => useContext(AuthContext);
