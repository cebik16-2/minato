// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuthToken, setAuthToken, decodeToken, logoutUser } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAuthToken());
  const [userId, setUserId] = useState(null);

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

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Access auth anywhere
export const useAuth = () => useContext(AuthContext);
