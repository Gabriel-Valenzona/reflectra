// ===========================================
// File: src/pages/ActivityFeed.tsx
// Description: Page for posting updates and searching users (Activity Feed)
// ===========================================

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import UserCard from "../components/UserCard";

export default function ActivityFeed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [followingList, setFollowingList] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  // ✅ Fetch following list
  const fetchFollowingList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/api/following/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.following) {
        const ids = response.data.following.map((u: any) => u.id);
        setFollowingList(ids);
      } else {
        setFollowingList([]);
      }
    } catch (error) {
      console.error("Error fetching following list:", error);
    }
  };

  // ✅ Fetch current user info
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/api/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(response.data.id);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // ✅ Fetch posts
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/api/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // ✅ Fetch users (for search)
  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/api/find_users/`, {
        params: query ? { q: query } : {},
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedUsers = response.data.map((u: any) => ({
        ...u,
        is_following: followingList.includes(u.id),
      }));

      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load user + following + posts
  useEffect(() => {
    fetchCurrentUser();
    fetchFollowingList();
    fetchPosts();
  }, []);

  // 🧾 Handle new post submission
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${BASE_URL}/api/posts/`,
        { content_text: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts([response.data, ...posts]);
      setNewPost("");
    } catch (error) {
      console.error("Error posting update:", error);
    }
  };

  // 🔍 Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    fetchUsers(searchQuery);
  };

  // 🧩 Follow/Unfollow toggle
  const handleFollowToggle = async (userId: number, currentlyFollowing: boolean) => {
    const token = localStorage.getItem("accessToken");
    const endpoint = currentlyFollowing
      ? `${BASE_URL}/api/unfollow/${userId}/`
      : `${BASE_URL}/api/follow/${userId}/`;

    try {
      await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });

      setFollowingList((prev) =>
        currentlyFollowing ? prev.filter((id) => id !== userId) : [...prev, userId]
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_following: !currentlyFollowing } : u
        )
      );

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, is_following: !currentlyFollowing });
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  // ✅ Filter posts to show only your posts + those you follow
  const visiblePosts = posts.filter(
    (post) =>
      post.user_id === currentUserId || followingList.includes(post.user_id)
  );

  return (
    <>
      <Header />
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 100px)",
          backgroundColor: "#0f172a",
          color: "white",
          paddingTop: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "inherit",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: "25px" }}>💬 Activity Feed</h1>

        {/* 📝 Post Box */}
        <form
          onSubmit={handlePostSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            width: "90%",
            maxWidth: "600px",
            marginBottom: "40px",
          }}
        >
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #475569",
              backgroundColor: "#0f172a",
              color: "white",
              fontSize: "1rem",
              resize: "none",
              marginBottom: "10px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              alignSelf: "flex-end",
            }}
          >
            Post
          </button>
        </form>

        {/* 📰 Posts List */}
        <div
          style={{
            width: "90%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: "#1e293b",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                <p style={{ marginBottom: "10px" }}>
                  <strong>{post.username}</strong> •{" "}
                  <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    {new Date(post.timestamp).toLocaleString()}
                  </span>
                </p>
                <p style={{ fontSize: "1rem" }}>{post.content_text}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "#94a3b8" }}>
              No posts yet. Follow someone to start interacting or share your first post!
            </p>
          )}
        </div>

        {/* 🔍 Search Users */}
        <h2 style={{ fontSize: "1.4rem", marginBottom: "20px" }}>🔍 Find Users</h2>

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
              backgroundColor: "#1e293b",
              color: "white",
              fontSize: "1rem",
              outline: "none",
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
            }}
          >
            Search
          </button>
        </form>

        {/* 👥 User Results */}
        {hasSearched && (
          loading ? (
            <p>Loading...</p>
          ) : users.length > 0 ? (
            <div
              style={{
                width: "90%",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginBottom: "40px",
              }}
            >
              {users.map((user) => (
                <div
                  key={user.id}
                  style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => setSelectedUser(user)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2d3b52")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1e293b")
                  }
                >
                  <p style={{ marginBottom: "5px", fontSize: "1.1rem", fontWeight: "600" }}>
                    {user.username}
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "8px" }}>
                    {user.email || "No email provided."}
                  </p>
                  <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
                    {user.bio || "No bio provided."}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal open when clicking button
                      handleFollowToggle(user.id, user.is_following);
                    }}
                    style={{
                      backgroundColor: user.is_following ? "#475569" : "#2563eb",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 20px",
                      color: "white",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = user.is_following
                        ? "#ef4444"
                        : "#1d4ed8")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = user.is_following
                        ? "#475569"
                        : "#2563eb")
                    }
                  >
                    {user.is_following ? "Unfollow" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#94a3b8" }}>No users found.</p>
          )
        )}


        
        {/* ✅ Selected User Modal */}
        {selectedUser && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setSelectedUser(null)}
          >
            <div
              style={{
                backgroundColor: "#1e293b",
                color: "white",
                borderRadius: "12px",
                padding: "30px",
                width: "90%",
                maxWidth: "500px",
                boxShadow: "0 6px 25px rgba(0,0,0,0.4)",
                textAlign: "center",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ❌
              </button>

              <h2 style={{ fontSize: "1.6rem", marginBottom: "10px" }}>
                {selectedUser.username}
              </h2>
              <p style={{ color: "#94a3b8", marginBottom: "10px" }}>
                {selectedUser.email}
              </p>
              <p style={{ fontSize: "1rem", marginBottom: "20px" }}>
                {selectedUser.bio || "No bio provided."}
              </p>

              <button
                onClick={() =>
                  handleFollowToggle(selectedUser.id, selectedUser.is_following)
                }
                style={{
                  backgroundColor: selectedUser.is_following ? "#475569" : "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                {selectedUser.is_following ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}