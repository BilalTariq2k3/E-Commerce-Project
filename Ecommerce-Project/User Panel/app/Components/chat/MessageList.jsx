"use client";

export default function MessageList({ messages, currentUserId }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        height: "420px",
        overflowY: "auto",
        background: "#fafafa",
      }}
    >
      {messages.length === 0 ? (
        <p style={{ color: "#666", margin: 0 }}>No messages yet.</p>
      ) : (
        messages.map((msg) => {
          const ownMessage = msg.senderId === currentUserId;
          return (
            <div
              key={msg._id || `${msg.senderId}-${msg.createdAt}`}
              style={{
                display: "flex",
                justifyContent: ownMessage ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  background: ownMessage ? "#0d6efd" : "#e9ecef",
                  color: ownMessage ? "#fff" : "#000",
                  borderRadius: "12px",
                  padding: "8px 12px",
                }}
              >
                <div>{msg.message}</div>
                <small style={{ opacity: 0.8 }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </small>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
