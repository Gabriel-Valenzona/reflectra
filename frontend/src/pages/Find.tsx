// ===========================================
// File: src/pages/Find.tsx
// Description: Page to search for users (shows all users by default, horizontal layout)
// ===========================================

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import UserCard from "../components/UserCard";

export default function Find() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  // ✅ Fetch users (all or search)
  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/api/find_users/`, {
        params: query ? { q: query } : {},
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load all users by default
  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  // 🧩 Follow/Unfollow
  const handleFollowToggle = async (userId: number, currentlyFollowing: boolean) => {
    const token = localStorage.getItem("accessToken");
    const endpoint = currentlyFollowing
      ? `${BASE_URL}/api/unfollow/${userId}/`
      : `${BASE_URL}/api/follow/${userId}/`;

    try {
      await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_following: !currentlyFollowing } : user
        )
      );
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  return (
    <>
      <Header />
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 100px)",
          backgroundColor: "#0f172a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "80px",
          color: "white",
          fontFamily: "inherit",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>🔍 Find Users</h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60%",
            maxWidth: "600px",
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 15px",
              borderRadius: "8px 0 0 8px",
              border: "1px solid #475569",
              outline: "none",
              fontSize: "1rem",
              color: "white",
              backgroundColor: "#1e293b",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#334155",
              color: "white",
              border: "none",
              borderRadius: "0 8px 8px 0",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#475569")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#334155")}
          >
            Search
          </button>
        </form>

        {/* Results */}
        {loading ? (
          <p>Loading...</p>
        ) : users.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
              width: "80%",
              maxWidth: "1000px",
            }}
          >
            {users.map((user) => (
              <UserCard
                key={user.id}
                username={user.username}
                email={user.email}
                bio={user.bio}
                isFollowing={user.is_following}
                onFollowToggle={() => handleFollowToggle(user.id, user.is_following)}
              />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "1rem", color: "#94a3b8" }}>
            No users found. Try searching or check back later.
          </p>
        )}
      </div>
    </>
  );
}