// src/pages/LoginPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState(""); // ✅ renamed (can be username or email)
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ automatically pick correct backend
  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ send single field "username" (can be email or username)
      const response = await axios.post(`${BASE_URL}/api/login/`, {
        username: loginInput, // <--- this matches backend key
        password,
      });

      const { access, refresh, user } = response.data;

      // ✅ store JWT tokens
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      console.log(`User logged in; username = ${user}`);
      console.log("Access token:", access);
      console.log("Refresh token:", refresh);

      setMessage(`✅ Login successful! Welcome, ${user}`);
      setTimeout(() => navigate("/home"), 1500);
    } catch (error: any) {
      console.error("Error:", error);
      if (error.response) {
        setMessage(`❌ ${error.response.data.error || "Invalid credentials"}`);
      } else {
        setMessage("⚠️ Server error. Please try again later.");
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <input
          type="text"
          placeholder="Username or Email"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#93c5fd" : "#2563eb",
            color: "white",
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p style={{ marginTop: "15px", color: "#374151" }}>{message}</p>
        )}

        <p style={{ marginTop: "20px", color: "#374151" }}>
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}