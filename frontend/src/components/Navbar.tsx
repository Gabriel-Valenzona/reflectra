// ===========================================
// File: src/components/Navbar.tsx
// Description: Shared top-right hamburger navigation menu
// ===========================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Handles logout and redirect to home page
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.log("🚪 User signed out and tokens cleared");
    navigate("/"); // ✅ Redirects to home page now
  };

  return (
    <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}>
      {/* Hamburger Icon */}
      <div
        style={{
          cursor: "pointer",
          width: "30px",
        }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div style={{ height: "4px", background: "white", marginBottom: "5px" }}></div>
        <div style={{ height: "4px", background: "white", marginBottom: "5px" }}></div>
        <div style={{ height: "4px", background: "white" }}></div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: 0,
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            width: "150px",
            textAlign: "left",
            color: "white", 
          }}
        >
          <p
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #334155",
            }}
            onClick={() => {
              setMenuOpen(false);
              navigate("/dashboard");
            }}
          >
            Dashboard
          </p>
          <p
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #334155",
            }}
            onClick={() => {
              setMenuOpen(false);
              navigate("/account");
            }}
          >
            Account
          </p>
          <p
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #334155",
            }}
            onClick={() => {
              setMenuOpen(false);
              navigate("/settings");
            }}
          >
            Settings
          </p>
          <p
            style={{ padding: "10px", cursor: "pointer", color: "#f87171" }}
            onClick={handleLogout}
          >
            Sign Out
          </p>
        </div>
      )}
    </div>
  );
}