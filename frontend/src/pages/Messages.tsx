// ===========================================
// File: src/pages/Messages.tsx
// Description: Inbox and message view with friendly chat suggestions
// ===========================================

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [following, setFollowing] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  // ✅ Fetch users the current user follows
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BASE_URL}/api/following/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFollowing(response.data.following || []);
      } catch (err) {
        console.error("Error fetching following list:", err);
      }
    };
    fetchFollowing();
  }, []);

  // ✅ Handle message send (frontend only for now)
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    console.log(`Message sent to ${selectedChat.username}: ${messageText}`);
    setMessageText("");
  };

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
          justifyContent: "center",
          alignItems: "flex-start",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "800px",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            padding: "25px",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: "30px",
          }}
        >
          {/* ✅ Inbox Section */}
          <div
            style={{
              borderBottom: "1px solid #334155",
              paddingBottom: "15px",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#94a3b8" }}>📥 Inbox</h3>
            <p style={{ color: "#94a3b8" }}>No mail.</p>
          </div>

          {/* ✅ Messages Section */}
          <div style={{ textAlign: "center" }}>
            {!selectedChat ? (
              <>
                <h2 style={{ color: "#cbd5e1" }}>Your Messages</h2>

                {/* If user has followers */}
                {following.length > 0 ? (
                  <>
                    <p style={{ color: "#94a3b8", marginTop: "10px" }}>
                      No active chats yet — maybe you can try messaging:
                    </p>
                    <div
                      style={{
                        marginTop: "15px",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "12px",
                      }}
                    >
                      {following.slice(0, 4).map((user) => (
                        <button
                          key={user.id}
                          onClick={() => setSelectedChat(user)}
                          style={{
                            backgroundColor: "#2563eb",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 14px",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "0.95rem",
                          }}
                        >
                          💬 {user.username}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  /* If user has no followers */
                  <p style={{ color: "#94a3b8", marginTop: "10px" }}>
                    No active chats yet — try following people on the Activity
                    Feed to start connecting!
                  </p>
                )}
              </>
            ) : (
              <div
                style={{
                  backgroundColor: "#0f172a",
                  padding: "20px",
                  borderRadius: "10px",
                  textAlign: "left",
                }}
              >
                <h3 style={{ color: "#cbd5e1" }}>
                  Chat with {selectedChat.username}
                </h3>

                {/* ✅ Message Input (frontend only) */}
                <form
                  onSubmit={handleSend}
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #334155",
                      backgroundColor: "#1e293b",
                      color: "white",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#2563eb",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 16px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Send
                  </button>
                </form>

                <button
                  onClick={() => setSelectedChat(null)}
                  style={{
                    marginTop: "15px",
                    background: "none",
                    color: "#94a3b8",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  ← Back to Inbox
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}