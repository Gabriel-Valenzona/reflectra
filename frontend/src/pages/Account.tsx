// ===========================================
// File: src/pages/Account.tsx
// Description: Profile page with editable info, posts, and follow management
// ===========================================

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";

export default function Account() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    bio: "",
    mood_preference: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [following, setFollowing] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setMessage("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const [userRes, followRes, postRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/userinfo/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/following/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/posts/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserInfo({
          username: userRes.data.username,
          email: userRes.data.email,
          bio: userRes.data.bio,
          mood_preference: userRes.data.mood_preference,
        });

        if (followRes.data.following) {
          setFollowing(followRes.data.following);
        } else {
          setFollowing([]);
        }

        setPosts(postRes.data.filter((p: any) => p.username === userRes.data.username));
      } catch (err) {
        console.error("Error loading account info:", err);
        setMessage("Failed to load account info.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  const handleFollowToggle = async (userId: number, currentlyFollowing: boolean) => {
    const token = localStorage.getItem("accessToken");
    const endpoint = currentlyFollowing
      ? `${BASE_URL}/api/unfollow/${userId}/`
      : `${BASE_URL}/api/follow/${userId}/`;

    try {
      await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });

      // Update UI instantly
      setFollowing((prev) =>
        currentlyFollowing
          ? prev.filter((u) => u.id !== userId)
          : [...prev, { id: userId, is_following: true }]
      );
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Saving...");

    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${BASE_URL}/api/update_user_info/`,
        {
          name: userInfo.username,
          email: userInfo.email,
          bio: userInfo.bio,
          mood: userInfo.mood_preference,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user info:", err);
      setMessage("❌ Failed to update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}/api/delete_account/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setMessage("🗑️ Account deleted successfully.");
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting account:", err);
      setMessage("❌ Failed to delete account.");
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}/api/posts/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Loading...</h2>
      </div>
    );

  return (
    <>
      <Navbar />
      <div
        style={{
          backgroundColor: "#0f172a",
          color: "white",
          minHeight: "100vh",
          padding: "40px 20px",
          fontFamily: "inherit",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "20px", textAlign: "center" }}>
          👤 My Profile
        </h1>

        {/* Following List */}
        <div
        style={{
            backgroundColor: "#1e293b",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "700px",
            margin: "0 auto 40px",
        }}
        >
        <h2>👥 Following</h2>
        {following.length > 0 ? (
            following.map((user) => (
            <div
                key={user.id}
                style={{
                backgroundColor: "#0f172a",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "15px",
                }}
            >
                <p style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "5px" }}>
                {user.username}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "8px" }}>
                {user.email || "No email provided."}
                </p>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                {user.bio || "No bio provided."}
                </p>
                <button
                onClick={() => handleFollowToggle(user.id, true)}
                style={{
                    marginTop: "10px",
                    backgroundColor: "#475569",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    color: "white",
                    cursor: "pointer",
                }}
                >
                Unfollow
                </button>
            </div>
            ))
        ) : (
            <p style={{ color: "#94a3b8" }}>You’re not following anyone yet.</p>
        )}
        </div>

        {/* User’s Posts */}
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "700px",
            margin: "0 auto 40px",
          }}
        >
          <h2>📝 My Posts</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: "#0f172a",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                }}
              >
                <p style={{ marginBottom: "10px" }}>{post.content_text}</p>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                  {new Date(post.timestamp).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#ef4444",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Delete Post
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: "#94a3b8" }}>You haven’t made any posts yet.</p>
          )}
        </div>

        {/* Edit Profile */}
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "700px",
            margin: "0 auto 40px",
          }}
        >
          <h2>⚙️ Edit Profile</h2>
          <form
            onSubmit={handleSave}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="Username"
              value={userInfo.username}
              onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
              style={{ padding: "10px", borderRadius: "5px", border: "none" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              style={{ padding: "10px", borderRadius: "5px", border: "none" }}
            />
            <textarea
              placeholder="Short bio..."
              value={userInfo.bio}
              onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
              rows={3}
              style={{ padding: "10px", borderRadius: "5px", border: "none" }}
            />
            <select
              value={userInfo.mood_preference}
              onChange={(e) =>
                setUserInfo({ ...userInfo, mood_preference: e.target.value })
              }
              style={{ padding: "10px", borderRadius: "5px", border: "none" }}
            >
              <option value="">Select mood</option>
              {[
                "happy",
                "sad",
                "angry",
                "tired",
                "chill",
                "motivated",
                "calm",
                "stressed",
                "neutral",
              ].map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            marginTop: "15px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            width: "300px",
          }}
        >
          Delete Account
        </button>

        {message && (
          <p style={{ marginTop: "15px", color: "#a5b4fc", textAlign: "center" }}>
            {message}
          </p>
        )}

        {showConfirm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#1e293b",
                padding: "30px",
                borderRadius: "10px",
                textAlign: "center",
                width: "320px",
              }}
            >
              <h2>Are you sure?</h2>
              <p>This will permanently delete your account.</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{
                    backgroundColor: "#334155",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}