/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Important for React + TypeScript
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a1e27",
        secondary: "#e9c675",
        textlight: "#cbd5e1",
      },
      maxWidth: {
        content: "1200px",
      },
      fontFamily: {
        header: ['"Playfair Display"', "serif"],
        sans: ['"Poppins"', "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
