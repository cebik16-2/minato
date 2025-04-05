// src/services/auth.jsx
import { BASE_URL, handleResponse } from "./helpers";
import { setAuthToken } from "../utils/auth";

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/users/sign_in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email: email.trim(),
        password: password.trim(),
      },
    }),
  });

  const data = await handleResponse(response);

  // ✅ Save token if present
  if (data.token) {
    setAuthToken(data.token);
  }

  return data; // you might get { token, user, message }
};
export const registerUser = async (email, password, passwordConfirmation) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email: email.trim(),
        password: password.trim(),
        password_confirmation: passwordConfirmation.trim(),
      },
    }),
  });

  const data = await handleResponse(response);

  // ✅ Save token if present
  if (data.token) {
    setAuthToken(data.token);
  }

  return data; // you might get { token, user, message }
};