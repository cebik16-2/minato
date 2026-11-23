import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

// Gate a route behind authentication.
//
// NOTE: the backend has no admin flag and no role column, so an
// authentication-only check is the honest ceiling here. A role check needs a
// backend field (for example user.admin) in the token or the user payload
// first; add it there before gating on it here.
const RequireAuth = ({ children }) => {
  const { token, openLoginModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // The app has no /login route: login is a modal rendered by App.jsx.
    if (!token) openLoginModal();
  }, [token, openLoginModal]);

  if (!token) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
