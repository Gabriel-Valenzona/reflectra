// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // ✅ toggle for hamburger
  const navigate = useNavigate();

  // ✅ Automatically pick correct backend
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
          withCredentials: false,
        });

        setUserInfo(response.data);
      } catch (err: any) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user info. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

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
    <div
      style={{
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ✅ Hamburger icon (top-right corner) */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          cursor: "pointer",
          width: "30px",
        }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div style={{ height: "4px", background: "white", marginBottom: "5px" }}></div>
        <div style={{ height: "4px", background: "white", marginBottom: "5px" }}></div>
        <div style={{ height: "4px", background: "white" }}></div>
      </div>

      {/* ✅ Dropdown menu */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            width: "150px",
            textAlign: "left",
            zIndex: 10,
          }}
        >
          <p
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #334155",
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

      {/* ✅ Main dashboard content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>🎉 You are now logged in!</h1>

        {userInfo ? (
          <>
            <p style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
              <strong>Username:</strong> {userInfo.username}
            </p>
            <p style={{ fontSize: "1.2rem" }}>
              <strong>Email:</strong> {userInfo.email}
            </p>
          </>
        ) : (
          <p>No user information available.</p>
        )}
      </div>
    </div>
  );
}