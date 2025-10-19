// ===========================================
// File: src/pages/WellnessTrends.tsx
// Description: Shows user's mood & stress progress over time (route: /wellness)
// ===========================================

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WellnessTrends() {
  const [data, setData] = useState([]);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BASE_URL}/api/moodlogs/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (err) {
        console.error("Error fetching mood logs:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Navbar />

      <div
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          color: "white",
          paddingTop: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "inherit",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: "25px" }}>📈 Wellness Trends</h1>

        {data.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>
            No check-ins yet — complete a Quick Check-In to start tracking your mood.
          </p>
        ) : (
          <div style={{ width: "90%", maxWidth: "700px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fill: "white" }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    color: "white",
                  }}
                />
                <Line type="monotone" dataKey="mood" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "10px" }}>
              💙 Mood (Blue) • 🔴 Stress (Red)
            </p>
          </div>
        )}
      </div>
    </>
  );
}