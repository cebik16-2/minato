import { useState, useEffect } from "react";
import { getUsers } from "../services/api";
import { getAuthToken } from "../utils/auth"; // ✅ Import token helper

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        setError("No authentication token found. Please log in.");
        return;
      }

      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes("401")) {
          console.warn("Unauthorized! Redirecting to login...");
          localStorage.removeItem("authToken"); // ✅ Clear invalid token
          window.location.href = "/"; // ✅ Redirect to homepage
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useUsers;
