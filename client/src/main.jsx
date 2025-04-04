import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/themes";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";


console.log("✅ React is starting...");

createRoot(document.getElementById("root")).render(
  <StrictMode>
        <AuthProvider>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
        </AuthProvider>
  </StrictMode>
);

console.log("✅ React has rendered!");
