import { useState } from "react";

const useLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setError(null);
  };

  return {
    username,
    password,
    error,
    setUsername,
    setPassword,
    setError,
    resetForm,
  };
};

export default useLoginForm;
