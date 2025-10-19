// ===========================================
// File: src/pages/WellnessTrends.tsx
// Description: Shows user's mood & stress progress over time (route: /wellness)
// ===========================================

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
  const [data, setData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayLogs, setDayLogs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  // ✅ Fetch user's mood logs
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

  // ✅ Handle date selection on calendar
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    // Filter logs by date (ignoring time)
    const sameDayLogs = data.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      return (
        entryDate.getFullYear() === date.getFullYear() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getDate() === date.getDate()
      );
    });

    setDayLogs(sameDayLogs);
    setShowModal(true);
  };

  // ✅ Inline CSS for calendar tile style
  const calendarStyles = `
    .react-calendar {
      background-color: transparent !important;
      border: none !important;
      color: white !important;
    }
    .react-calendar__navigation button {
      color: white !important;
    }
    .react-calendar__month-view__weekdays {
      text-transform: uppercase;
      color: #94a3b8;
    }
    .react-calendar__tile {
      background: transparent !important;
      color: white !important;
      border-radius: 8px;
      transition: background-color 0.2s;
    }
    .react-calendar__tile:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
    .react-calendar__tile--now {
      background-color: rgba(37, 99, 235, 0.2) !important;
    }
    .has-log {
      background-color: rgba(37, 99, 235, 0.6) !important;
      color: white !important;
      border-radius: 50%;
    }
  `;

  return (
    <>
      <Header />
      <Navbar />

      {/* ✅ Inject styles only for the calendar and modal */}
      <style>{calendarStyles}</style>

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
          <>
            {/* ✅ Keep existing chart styling untouched */}
            <div style={{ width: "90%", maxWidth: "700px", marginBottom: "40px" }}>
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
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="stress"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p
                style={{
                  color: "#94a3b8",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                💙 Mood (Blue) • 🔴 Stress (Red)
              </p>
            </div>

            {/* ✅ Calendar section styled like chart (transparent look) */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid #475569",
                borderRadius: "12px",
                padding: "20px",
                width: "90%",
                maxWidth: "400px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "1.4rem", marginBottom: "10px" }}>🗓️ Daily Logs</h2>
              <Calendar
                onClickDay={handleDateClick}
                tileClassName={({ date }) => {
                  const hasLog = data.some((entry) => {
                    const entryDate = new Date(entry.timestamp);
                    return (
                      entryDate.getFullYear() === date.getFullYear() &&
                      entryDate.getMonth() === date.getMonth() &&
                      entryDate.getDate() === date.getDate()
                    );
                  });
                  return hasLog ? "has-log" : "";
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* ✅ Modal with chart-style (transparent + white) */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.95)",
              border: "1px solid #475569",
              borderRadius: "12px",
              padding: "20px",
              width: "90%",
              maxWidth: "500px",
              color: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "15px", textAlign: "center" }}>
              🧠 Check-Ins for{" "}
              {selectedDate?.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>

            {dayLogs.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center" }}>
                No entries for this day.
              </p>
            ) : (
              dayLogs.map((log, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid #475569",
                    paddingBottom: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <p>
                    <strong>🕓 Time:</strong>{" "}
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <strong>💙 Mood:</strong> {log.mood}/10
                  </p>
                  <p>
                    <strong>🔴 Stress:</strong> {log.stress}/10
                  </p>
                  <p>
                    <strong>😴 Sleep:</strong> {log.sleep}
                  </p>
                  {log.notes && (
                    <p>
                      <strong>📝 Notes:</strong> {log.notes}
                    </p>
                  )}
                </div>
              ))
            )}

            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: "#2563eb",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                color: "white",
                cursor: "pointer",
                marginTop: "10px",
                width: "100%",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}