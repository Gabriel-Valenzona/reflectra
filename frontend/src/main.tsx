// ===========================================
// File: src/main.tsx
// Description: App entry point with global Axios interceptor (safe for login/register)
// ===========================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

// ✅ Global Axios interceptor (skips login/register routes)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ignore 401s from login or register routes
    if (
      error.config &&
      (error.config.url.includes("/api/login/") ||
        error.config.url.includes("/api/register/"))
    ) {
      return Promise.reject(error);
    }

    // Redirect only if token is invalid for logged-in requests
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Unauthorized or expired token — redirecting to home.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);