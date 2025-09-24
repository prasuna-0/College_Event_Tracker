import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CoordinatorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5226/api/Notification", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setError("❌ Failed to fetch notifications");
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5226/api/Notification/mark-as-read/${notificationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Styles
  const containerStyle = {
    padding: "20px",
    maxWidth: "700px",
    margin: "40px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = (isRead) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    border: "1px solid #ccc",
    padding: "15px 20px",
    marginBottom: "15px",
    borderRadius: "10px",
    backgroundColor: isRead ? "#f0f0f0" : "#ffffff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    transition: "transform 0.2s, box-shadow 0.2s",
  });

  const cardContentStyle = { maxWidth: "80%" };
  const titleStyle = { margin: "0 0 8px 0", fontSize: "17px", fontWeight: "600", color: "#333" };
  const messageStyle = { margin: 0, fontSize: "14px", color: "#555" };
  const dateStyle = { color: "#888", fontSize: "12px", marginTop: "6px" };
  const markButtonStyle = {
    padding: "6px 12px",
    fontSize: "13px",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "5px",
    border: "none",
    alignSelf: "flex-start",
  };
  const headerStyle = { textAlign: "center", marginBottom: "25px" };

  if (loading) return <p style={{ textAlign: "center" }}>Loading notifications...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f7", padding: "20px" }}>
      <div style={containerStyle}>
        <h2 style={headerStyle}>Coordinator Notifications</h2>

        {notifications.length === 0 && <p>No notifications available.</p>}

        {notifications.map((notif) => (
          <div
            key={notif.id}
            style={cardStyle(notif.isRead)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.05)";
            }}
          >
            <div style={cardContentStyle}>
              <h4 style={titleStyle}>{notif.title}</h4>
              <p style={messageStyle}>{notif.message}</p>
              <small style={dateStyle}>
                {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
              </small>
            </div>
            {!notif.isRead && (
              <button
                style={markButtonStyle}
                onClick={() => markAsRead(notif.id)}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
