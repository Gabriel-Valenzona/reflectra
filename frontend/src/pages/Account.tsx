// src/pages/Account.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // ✅ Import the shared navbar

export default function Account() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    bio: "",
    mood_preference: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  // ✅ Fetch current user info
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

  // ✅ Handle profile update
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
      <Navbar /> {/* ✅ Stays fixed in top-right corner */}
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

        {message && (
          <p style={{ marginTop: "15px", color: "#a5b4fc" }}>{message}</p>
        )}
      </div>
    </>
  );
}