"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
} from "../../features/NotificationApi";
import "./Header.css";

function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

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

const getChatUnreadFromStorage = () => {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("admin_chat_unread");
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") return 0;
    return Object.values(parsed).reduce((sum, count) => sum + Number(count || 0), 0);
  } catch {
    return 0;
  }
};

export default function Header() {
  const { data: notifications = [], isLoading, refetch } = useGetNotificationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation();
  const openRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [orderUnreadCount, setOrderUnreadCount] = useState(0);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    setChatUnreadCount(getChatUnreadFromStorage());

    const handleChatUnread = (event) => {
      const count = Number(event?.detail?.count || 0);
      setChatUnreadCount(count);
    };

    const syncFromStorage = () => {
      setChatUnreadCount(getChatUnreadFromStorage());
    };

    window.addEventListener("admin-chat-unread", handleChatUnread);
    window.addEventListener("focus", syncFromStorage);
    const intervalId = window.setInterval(syncFromStorage, 1000);

    return () => {
      window.removeEventListener("admin-chat-unread", handleChatUnread);
      window.removeEventListener("focus", syncFromStorage);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const socket = io(getSocketUrl(), {
      transports: ["polling", "websocket"],
      reconnection: true,
    });

    socket.on("adminNotification", () => {
      refetch();
      if (!openRef.current) {
        setOrderUnreadCount((prev) => prev + 1);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Admin notification socket error:", error.message);
    });

    return () => socket.disconnect();
  }, [refetch]);

  const totalCount = orderUnreadCount + chatUnreadCount;

  const handleClick = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setOrderUnreadCount(0);
      }
      return next;
    });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const previousList = visibleNotifications;
    setVisibleNotifications((prev) => prev.filter((item) => item._id !== id));

    try {
      await deleteNotification(id).unwrap();
    } catch (error) {
      console.error("Delete notification failed:", error);
      setVisibleNotifications(previousList);
    }
  };

  return (
    <div className="header d-flex justify-content-between align-items-center px-5 py-4">
      <h1>Admin Panel</h1>

      <div className="notif-wrapper">
        <div className="bell" onClick={handleClick}>
          <span className={`bell-icon ${totalCount > 0 ? "active" : ""}`}>🔔</span>

          {totalCount > 0 && (
            <span className="count">{totalCount > 99 ? "99+" : totalCount}</span>
          )}
        </div>

        {open && (
          <div className="dropdown">
            <h6>Notifications</h6>
            <div className="dropdown-list">
              {isLoading ? (
                <p>Loading...</p>
              ) : visibleNotifications.length === 0 && chatUnreadCount === 0 ? (
                <p>No notifications</p>
              ) : (
                <>
                  {chatUnreadCount > 0 && (
                    <div className="item notif-item">
                      <div className="notif-body">
                        <div className="notif-message">
                          You have {chatUnreadCount} unread chat message
                          {chatUnreadCount > 1 ? "s" : ""}.
                        </div>
                        <div className="notif-datetime">Open chat icon to read messages.</div>
                      </div>
                    </div>
                  )}

                  {visibleNotifications.map((n) => (
                    <div key={n._id} className="item notif-item">
                      <div className="notif-body">
                        <div className="notif-message">{n.message}</div>
                        <div className="notif-datetime" suppressHydrationWarning>
                          {mounted ? formatDateTime(n.createdAt) : ""}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger notif-delete"
                        onClick={(e) => handleDelete(e, n._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
