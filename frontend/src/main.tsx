// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

/**
 * Import Tailwind and the tiny custom CSS shims.
 * If you are still using src/index.css for legacy styles, import it first so Tailwind can override where necessary:
 *
 * import "./index.css";
 */
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
