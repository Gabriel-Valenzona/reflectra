// ===========================================
// File: src/pages/Messages.tsx
// Description: Inbox and message view (top-bottom layout, unified design)
// ===========================================

import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.9rem",
                marginTop: "10px",
              }}
            >
              You can message one of your followers once available.
            </p>
          </div>

          {/* ✅ Messages Section */}
          <div style={{ textAlign: "center" }}>
            {!selectedChat ? (
              <>
                <h2 style={{ color: "#cbd5e1" }}>Your Messages</h2>
                <p style={{ color: "#94a3b8", marginTop: "10px" }}>
                  No active chats yet.
                </p>
              </>
            ) : (
              <p style={{ color: "#94a3b8" }}>
                Conversation with {selectedChat}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}