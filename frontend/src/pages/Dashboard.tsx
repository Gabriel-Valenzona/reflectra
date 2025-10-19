// ===========================================
// File: src/pages/Dashboard.tsx
// Description: Dashboard page showing user info after login with optional mood check-in quiz
// ===========================================

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState("");
  const [stress, setStress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
    <>
      <Header />
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 100px)",
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "inherit",
          padding: "40px 20px",
        }}
      >
        {userInfo ? (
          <>
            <h1 style={{ fontSize: "2rem", textAlign: "center", marginBottom: "20px" }}>
              👋 Welcome, {userInfo.username}!
            </h1>

            {!showQuiz && !submitted && (
              <button
                onClick={() => setShowQuiz(true)}
                style={{
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Take a Quick Check-In 🧠
              </button>
            )}

            {showQuiz && !submitted && (
              <form
                onSubmit={handleSubmit}
                style={{
                  backgroundColor: "#1e293b",
                  padding: "25px",
                  borderRadius: "12px",
                  width: "90%",
                  maxWidth: "500px",
                  marginTop: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <label>
                  How are you feeling today? (1–10)
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={mood ?? ""}
                    onChange={(e) => setMood(Number(e.target.value))}
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #475569",
                      backgroundColor: "#0f172a",
                      color: "white",
                    }}
                  />
                </label>

                <label>
                  How did you sleep last night?
                  <select
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #475569",
                      backgroundColor: "#0f172a",
                      color: "white",
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="great">Great 😴</option>
                    <option value="okay">Okay 😐</option>
                    <option value="poor">Poor 😩</option>
                  </select>
                </label>

                <label>
                  How stressed are you feeling? (1–10)
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={stress ?? ""}
                    onChange={(e) => setStress(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "5px",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #475569",
                      backgroundColor: "#0f172a",
                      color: "white",
                    }}
                  />
                </label>

                <label>
                  Anything on your mind today?
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Optional thoughts..."
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #475569",
                      backgroundColor: "#0f172a",
                      color: "white",
                      resize: "none",
                    }}
                  />
                </label>

                <button
                  type="submit"
                  style={{
                    backgroundColor: "#2563eb",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    color: "white",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Submit
                </button>
              </form>
            )}

            {submitted && (
              <div
                style={{
                  backgroundColor: "#1e293b",
                  padding: "25px",
                  borderRadius: "12px",
                  width: "90%",
                  maxWidth: "500px",
                  marginTop: "20px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <h3>✅ Thanks for checking in!</h3>
                <p style={{ color: "#94a3b8" }}>
                  Take it easy today, {userInfo.username}. Remember to breathe and take breaks 💙
                </p>
              </div>
            )}
          </>
        ) : (
          <p>No user information available.</p>
        )}
      </div>
    </>
  );
}