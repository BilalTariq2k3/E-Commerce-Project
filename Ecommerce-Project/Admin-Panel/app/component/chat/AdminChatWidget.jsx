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

export default function AdminChatWidget() {
  const socketRef = useRef(null);
  const roomRef = useRef("");
  const openRef = useRef(false);
  const unreadRef = useRef({});
  const processedMessageIdsRef = useRef(new Set());
  const processedUnreadIdsRef = useRef(new Set());
  const [open, setOpen] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [unreadByRoom, setUnreadByRoom] = useState({});

  const roomId = useMemo(
    () => (selectedUserId ? `user_${selectedUserId}` : ""),
    [selectedUserId],
  );

  useEffect(() => {
    roomRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    unreadRef.current = unreadByRoom;
  }, [unreadByRoom]);

  const getMessageKey = (message) => {
    if (!message) return "";
    return (
      message._id ||
      `${message.roomId || ""}:${message.senderId || ""}:${message.createdAt || ""}:${message.message || ""}`
    );
  };

  const incrementUnreadOnce = (message) => {
    const key = getMessageKey(message);
    if (!key || processedUnreadIdsRef.current.has(key)) return;

    const isCurrentOpenRoom = openRef.current && roomRef.current === message.roomId;
    if (isCurrentOpenRoom) return;

    processedUnreadIdsRef.current.add(key);
    setUnreadByRoom((prev) => ({
      ...prev,
      [message.roomId]: (prev[message.roomId] || 0) + 1,
    }));
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const session = await getSession();
      const id = session?.user?.id;
      if (!mounted || !id) return;

      setAdminId(id);
      const socket = io(getSocketUrl(), {
        transports: ["polling", "websocket"],
        reconnection: true,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("joinAdminRoom");
        if (roomRef.current) {
          socket.emit("joinRoom", { roomId: roomRef.current });
          socket.emit("loadMessages", { roomId: roomRef.current });
        }
      });

      socket.on("messageHistory", ({ roomId: incomingRoomId, messages: history }) => {
        if (incomingRoomId === roomRef.current) {
          const list = Array.isArray(history) ? history : [];
          list.forEach((item) => {
            const key = getMessageKey(item);
            if (key) processedMessageIdsRef.current.add(key);
          });
          setMessages(list);
        }
      });

      socket.on("newMessage", (message) => {
        if (!message?.roomId) return;

        const key = getMessageKey(message);
        if (key && processedMessageIdsRef.current.has(key)) {
          return;
        }
        if (key) processedMessageIdsRef.current.add(key);

        if (message.roomId === roomRef.current) {
          setMessages((prev) => {
            const exists = prev.some((item) => getMessageKey(item) === key);
            return exists ? prev : [...prev, message];
          });
        }

        if (String(message.senderRole) === "user") {
          incrementUnreadOnce(message);
        }
      });

      socket.on("adminUnreadMessage", (message) => {
        if (!message?.roomId) return;
        incrementUnreadOnce(message);
      });

      socket.on("connect_error", (error) => {
        console.error("Admin chat socket error:", error.message);
      });
    };

    const loadUsers = async () => {
      const response = await fetch("/api/user", { cache: "no-store" });
      const payload = await response.json();
      const list = payload?.data || [];
      if (!mounted) return;
      setUsers(list);
      const savedUnread = JSON.parse(localStorage.getItem("admin_chat_unread") || "{}");
      setUnreadByRoom(savedUnread && typeof savedUnread === "object" ? savedUnread : {});
      if (list.length > 0) {
        setSelectedUserId(String(list[0]._id));
      }
    };

    initialize();
    loadUsers();

    return () => {
      mounted = false;
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current || !roomId) return;
    setMessages([]);
    socketRef.current.emit("joinRoom", { roomId });
    socketRef.current.emit("loadMessages", { roomId });
    if (openRef.current) {
      setUnreadByRoom((prev) => ({ ...prev, [roomId]: 0 }));
    }
  }, [roomId]);

  useEffect(() => {
    openRef.current = open;
    if (open && roomId) {
      setUnreadByRoom((prev) => ({ ...prev, [roomId]: 0 }));
    }
  }, [open, roomId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_chat_unread", JSON.stringify(unreadByRoom));
    }
  }, [unreadByRoom]);

  const unreadTotal = Object.values(unreadByRoom).reduce((sum, count) => sum + count, 0);
  const selectedUser = users.find((user) => String(user._id) === String(selectedUserId));

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("admin-chat-unread", {
          detail: { count: unreadTotal },
        }),
      );
    }
  }, [unreadTotal]);

  const sendMessage = () => {
    if (!socketRef.current || !text.trim() || !roomId || !adminId || !selectedUserId) return;
    socketRef.current.emit("sendMessage", {
      roomId,
      senderId: adminId,
      senderRole: "admin",
      receiverId: selectedUserId,
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
          boxShadow: unreadTotal > 0 ? "0 0 0 3px rgba(220,53,69,0.35)" : "none",
          color: "#fff",
          fontSize: "22px",
          zIndex: 1200,
        }}
      >
        <i className="bi bi-chat-dots-fill" />
        {unreadTotal > 0 && (
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
            {unreadTotal > 99 ? "99+" : unreadTotal}
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
          }}
        >
          <div
            style={{
              width: "72px",
              borderRight: "1px solid #eee",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ overflowY: "auto", flex: 1 }}>
              {users.map((user) => {
                const userRoomId = `user_${user._id}`;
                const isSelected = String(user._id) === String(selectedUserId);
                const roomUnread = unreadByRoom[userRoomId] || 0;
                const displayName = `${user.fname || ""} ${user.lname || ""}`.trim() || "User";

                return (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => setSelectedUserId(String(user._id))}
                    style={{
                      position: "relative",
                      width: "100%",
                      border: "none",
                      background: isSelected ? "#f4f7ff" : "#fff",
                      borderBottom: "1px solid #f1f1f1",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={displayName}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: isSelected ? "2px solid #0d6efd" : "1px solid #ddd",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          background: "#0d6efd",
                          color: "#fff",
                          border: isSelected ? "2px solid #0d6efd" : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                        }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {roomUnread > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          right: "12px",
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
                        {roomUnread > 99 ? "99+" : roomUnread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                padding: "12px",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {selectedUser?.profileImage ? (
                <img
                  src={selectedUser.profileImage}
                  alt={selectedUser.email || "Selected user"}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#0d6efd",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {selectedUser
                    ? `${selectedUser.fname || ""} ${selectedUser.lname || ""}`
                        .trim()
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>
                  {selectedUser
                    ? `${selectedUser.fname || ""} ${selectedUser.lname || ""}`.trim() || "User"
                    : "Select user"}
                </div>
                <div style={{ fontSize: "12px", color: "#777" }}>
                  {selectedUser?.email || ""}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
              {messages.length === 0 && (
                <p style={{ color: "#777", margin: 0 }}>No messages yet.</p>
              )}
              {messages.map((msg) => {
                const mine = String(msg.senderId) === String(adminId);
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

            <div
              style={{
                padding: "10px",
                borderTop: "1px solid #eee",
                display: "flex",
                gap: "8px",
              }}
            >
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
        </div>
      )}
    </div>
  );
}
