// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// React Fast Refresh is what auto-updates the browser without a full reload
export default defineConfig({
  plugins: [react()],
});
