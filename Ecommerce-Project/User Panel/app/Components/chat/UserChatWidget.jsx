"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSession } from "next-auth/react";
import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${window.location.hostname}:5000`;
  }

  return "http://localhost:5000";
};

export default function UserChatWidget() {
  const socketRef = useRef(null);
  const openRef = useRef(false);
  const lastReadRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const roomId = useMemo(() => (userId ? `user_${userId}` : ""), [userId]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const session = await getSession();
      const id = session?.user?.id;
      if (!mounted || !id) return;

      setUserId(id);
      const socket = io(getSocketUrl(), {
        transports: ["polling", "websocket"],
        reconnection: true,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        const chatRoomId = `user_${id}`;
        socket.emit("joinRoom", { roomId: chatRoomId });
        socket.emit("loadMessages", { roomId: chatRoomId });
      });

      socket.on("connect_error", (error) => {
        console.error("User chat socket error:", error.message);
      });

      socket.on("messageHistory", ({ roomId: incomingRoomId, messages: history }) => {
        if (incomingRoomId === `user_${id}`) {
          const list = Array.isArray(history) ? history : [];
          setMessages(list);

          const unreadFromHistory = list.filter((msg) => {
            if (String(msg.senderRole) !== "admin") return false;
            const msgTime = new Date(msg.createdAt || 0).getTime();
            return msgTime > lastReadRef.current;
          }).length;

          if (!openRef.current) {
            setUnreadCount(unreadFromHistory);
          }
        }
      });

      socket.on("newMessage", (message) => {
        if (message?.roomId === `user_${id}`) {
          setMessages((prev) => [...prev, message]);
          if (String(message.senderRole) === "admin" && !openRef.current) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      });
    };

    initialize();

    return () => {
      mounted = false;
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    openRef.current = open;
    if (open) {
      const now = Date.now();
      lastReadRef.current = now;
      if (userId) {
        localStorage.setItem(`chat_last_read_${userId}`, String(now));
      }
      setUnreadCount(0);
    }
  }, [open]);

  useEffect(() => {
    if (!userId || typeof window === "undefined") return;
    const saved = Number(localStorage.getItem(`chat_last_read_${userId}`) || 0);
    lastReadRef.current = Number.isNaN(saved) ? 0 : saved;
  }, [userId]);

  const sendMessage = () => {
    if (!socketRef.current || !text.trim() || !roomId || !userId) return;

    socketRef.current.emit("sendMessage", {
      roomId,
      senderId: userId,
      senderRole: "user",
      receiverId: "admin",
      message: text.trim(),
    });
    setText("");
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          border: "none",
          background: "#0d6efd",
          boxShadow: unreadCount > 0 ? "0 0 0 3px rgba(220,53,69,0.35)" : "none",
          color: "#fff",
          fontSize: "22px",
          zIndex: 1200,
        }}
      >
        <i className="bi bi-chat-dots-fill" />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              minWidth: "20px",
              height: "20px",
              borderRadius: "10px",
              background: "#dc3545",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            bottom: "86px",
            width: "340px",
            height: "430px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            zIndex: 1200,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "12px", borderBottom: "1px solid #eee", fontWeight: 600 }}>
            Chat with Admin
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            {messages.length === 0 && (
              <p style={{ color: "#777", margin: 0 }}>No messages yet.</p>
            )}
            {messages.map((msg) => {
              const mine = String(msg.senderId) === String(userId);
              return (
                <div
                  key={msg._id || `${msg.senderId}-${msg.createdAt}`}
                  style={{
                    display: "flex",
                    justifyContent: mine ? "flex-end" : "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      background: mine ? "#0d6efd" : "#e9ecef",
                      color: mine ? "#fff" : "#111",
                      borderRadius: "10px",
                      padding: "8px 10px",
                      maxWidth: "75%",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: "10px", borderTop: "1px solid #eee", display: "flex", gap: "8px" }}>
            <textarea
              className="form-control"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              rows={1}
              style={{ resize: "none", maxHeight: "100px", overflowY: "auto" }}
            />
            <button type="button" className="btn btn-primary" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
