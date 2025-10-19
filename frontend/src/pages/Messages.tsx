// ===========================================
// File: src/pages/Messages.tsx
// Description: Inbox and Messages sections clearly separated with headers
// ===========================================

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [following, setFollowing] = useState<any[]>([]);
  const [inbox, setInbox] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [currentUser, setCurrentUser] = useState<string>("");

  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://reflectra-backend.onrender.com";

  // ✅ Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${BASE_URL}/api/userinfo/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data.username);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch following
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

  // ✅ Fetch inbox
  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BASE_URL}/api/inbox/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInbox(response.data || []);
      } catch (err) {
        console.error("Error fetching inbox:", err);
      }
    };
    fetchInbox();
  }, []);

  // ✅ Fetch conversation when user selects a chat
  useEffect(() => {
    const fetchConversation = async () => {
      if (!selectedChat) return;
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${BASE_URL}/api/messages/${selectedChat.username}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching conversation:", err);
      }
    };
    fetchConversation();
  }, [selectedChat]);

  // ✅ Send a message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${BASE_URL}/api/messages/send/`,
        {
          receiver: selectedChat.username,
          content: messageText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [...prev, response.data]);
      setMessageText("");

      const inboxRes = await axios.get(`${BASE_URL}/api/inbox/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInbox(inboxRes.data || []);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ✅ Helper: Determine chat partner name for inbox
  const getChatPartner = (msg: any) => {
    if (msg.sender_username === currentUser) {
      return msg.receiver_username;
    } else {
      return msg.sender_username;
    }
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
            maxWidth: "900px",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            padding: "25px",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: "25px",
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

            {inbox.length > 0 ? (
              <div>
                {inbox.map((chat, index) => {
                  const partner = getChatPartner(chat);
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedChat({ username: partner })}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedChat?.username === partner
                            ? "#334155"
                            : "#1e293b",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <strong style={{ color: "#cbd5e1" }}>{partner}</strong>
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.9rem",
                          marginTop: "3px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {chat.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "#94a3b8" }}>
                No messages yet — start chatting with someone you follow!
              </p>
            )}
          </div>

          {/* ✅ Divider / New Section Header */}
          <div
            style={{
              borderTop: "1px solid #334155",
              paddingTop: "10px",
              marginTop: "10px",
            }}
          >
            <h3 style={{ marginBottom: "15px", color: "#94a3b8" }}>💬 Messages</h3>
          </div>

          {/* ✅ Message Section */}
          <div
            style={{
              backgroundColor: "#0f172a",
              borderRadius: "10px",
              padding: "25px",
              marginTop: "5px",
            }}
          >
            {!selectedChat ? (
              <>
                <h2 style={{ color: "#cbd5e1", textAlign: "center" }}>
                  Select a chat to start messaging
                </h2>

                {following.length === 0 && inbox.length === 0 && (
                  <p
                    style={{
                      color: "#94a3b8",
                      textAlign: "center",
                      marginTop: "10px",
                    }}
                  >
                    You haven’t followed anyone yet — visit the Activity Feed to
                    start connecting!
                  </p>
                )}

                {following.length > 0 && inbox.length === 0 && (
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

                {/* ✅ Message History */}
                <div
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    backgroundColor: "#1e293b",
                    padding: "10px",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                >
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        style={{
                          textAlign:
                            msg.sender_username === currentUser
                              ? "right"
                              : "left",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            backgroundColor:
                              msg.sender_username === currentUser
                                ? "#2563eb"
                                : "#334155",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            color: "white",
                            maxWidth: "70%",
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#94a3b8" }}>
                      No messages yet — start the conversation!
                    </p>
                  )}
                </div>

                {/* ✅ Message Input */}
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