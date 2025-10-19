// ===========================================
// File: src/components/Header.tsx
// Description: Dashboard header with "Activity Feed", "Wellness Trends", and "Inbox" links
// ===========================================

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header
      style={{
        backgroundColor: "#0f172a",
        color: "white",
        padding: "20px 0",
        borderBottom: "2px solid transparent",
        textAlign: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Navigation Links */}
      <nav style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
        {/* Activity Feed */}
        <span
          onClick={() => navigate("/activity")}
          style={{
            cursor: "pointer",
            fontSize: "1.1rem",
            color: "#cbd5e1",
            transition: "color 0.3s",
            textDecoration: "underline",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
        >
          Activity Feed
        </span>

        {/* Wellness Trends */}
        <span
          onClick={() => navigate("/wellness")}
          style={{
            cursor: "pointer",
            fontSize: "1.1rem",
            color: "#cbd5e1",
            transition: "color 0.3s",
            textDecoration: "underline",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
        >
          Wellness Trends
        </span>

        {/* ✅ Inbox (new link) */}
        <span
          onClick={() => navigate("/messages")}
          style={{
            cursor: "pointer",
            fontSize: "1.1rem",
            color: "#cbd5e1",
            transition: "color 0.3s",
            textDecoration: "underline",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
        >
          Inbox
        </span>
      </nav>
    </header>
  );
}