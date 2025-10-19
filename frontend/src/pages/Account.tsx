// src/pages/Account.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // ✅ Shared navbar

export default function Account() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    bio: "",
    mood_preference: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false); // ✅ For delete modal

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  // ✅ Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setMessage("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/userinfo/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo({
          username: response.data.username || "",
          email: response.data.email || "",
          bio: response.data.bio || "",
          mood_preference: response.data.mood_preference || "",
        });
      } catch (err) {
        console.error("Error fetching user info:", err);
        setMessage("Failed to fetch user info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // ✅ Save updates
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user info:", err);
      setMessage("❌ Failed to update profile.");
    }
  };

  // ✅ Delete account
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
          height: "100vh",
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>👤 Account Settings</h1>

        <form
          onSubmit={handleSave}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
          }}
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

        {/* ✅ Delete Account Button */}
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
            width: "300px",
          }}
        >
          Delete Account
        </button>

        {message && (
          <p style={{ marginTop: "15px", color: "#a5b4fc" }}>{message}</p>
        )}

        {/* ✅ Confirmation Modal */}
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