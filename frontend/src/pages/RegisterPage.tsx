// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Automatically pick backend URL
  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // POST request to Django backend registration endpoint
      const response = await axios.post(`${BASE_URL}/api/register/`, {
        username,
        email,
        password,
      });

      setMessage("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      console.error("Error:", error);
      if (error.response) {
        setMessage(`❌ ${error.response.data.error || "Registration failed"}`);
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
          width: "320px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p style={{ marginTop: "15px", color: "#374151" }}>{message}</p>
        )}

        {/* Login redirect link */}
        <p style={{ marginTop: "20px", color: "#374151" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
