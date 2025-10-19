// src/pages/Settings.tsx
import React from "react";
import Navbar from "../components/Navbar"; // ✅ Import shared Navbar

export default function Settings() {
  return (
    <>
      <Navbar /> {/* ✅ Always visible top-right hamburger menu */}
      <div
        style={{
          height: "100vh",
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>⚙️ Settings</h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.8 }}>
          Settings coming soon...
        </p>
      </div>
    </>
  );
}