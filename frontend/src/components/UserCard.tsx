// ===========================================
// File: src/components/UserCard.tsx
// Description: Displays a user's info and follow button (click to expand profile)
// ===========================================

import React, { useState } from "react";

interface UserCardProps {
  id: number;
  username: string;
  email: string;
  bio: string;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  onClick?: () => void; // ✅ added to support profile expansion
}

export default function UserCard({
  id,
  username,
  email,
  bio,
  isFollowing = false,
  onFollowToggle,
  onClick,
}: UserCardProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering profile click
    setFollowing(!following);
    if (onFollowToggle) onFollowToggle();
  };

  return (
    <div
      onClick={onClick} // ✅ click card to open/expand profile
      style={{
        backgroundColor: "#1e293b",
        color: "white",
        borderRadius: "10px",
        padding: "20px",
        width: "280px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      }}
    >
      <h2 style={{ fontSize: "1.4rem", marginBottom: "5px" }}>{username}</h2>
      <p style={{ color: "#94a3b8", marginBottom: "8px" }}>{email}</p>
      <p style={{ fontSize: "0.95rem", marginBottom: "15px", opacity: 0.9 }}>
        {bio || "No bio provided."}
      </p>

      <button
        onClick={handleFollow}
        style={{
          backgroundColor: following ? "#475569" : "#2563eb",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}