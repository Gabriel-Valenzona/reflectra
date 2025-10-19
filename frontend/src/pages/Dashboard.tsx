// ===========================================
// File: src/pages/Dashboard.tsx
// Description: Dashboard page showing user info after login
// ===========================================

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ shared navbar

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/userinfo/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo({ username: response.data.username });
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user info. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [navigate]);

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#0f172a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <h2>Loading...</h2>
      </div>
    );

  if (error)
    return (
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
        <h2>{error}</h2>
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
        }}
      >
        {userInfo ? (
          <h1 style={{ fontSize: "2rem" }}>👋 Welcome, {userInfo.username}!</h1>
        ) : (
          <p>No user information available.</p>
        )}
      </div>
    </>
  );
}