// ===========================================
// File: src/components/UserCard.tsx
// Description: Displays a user's info and follow/unfollow button
// ===========================================

import React, { useState } from "react";

interface UserCardProps {
  username: string;
  email: string;
  bio: string;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

export default function UserCard({
  username,
  email,
  bio,
  isFollowing = false,
  onFollowToggle,
}: UserCardProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = () => {
    setFollowing(!following);
    if (onFollowToggle) onFollowToggle();
  };

  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        color: "white",
        borderRadius: "10px",
        padding: "20px",
        margin: "15px 0",
        width: "300px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", marginBottom: "5px" }}>{username}</h2>
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