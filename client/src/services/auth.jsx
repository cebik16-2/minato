import { BASE_URL, handleResponse } from "./helpers";
import { setAuthToken } from "../utils/auth";

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/users/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: { email, password } }),
  });

  const data = await handleResponse(response);
  if (data.token) setAuthToken(data.token);
  return data;
};
