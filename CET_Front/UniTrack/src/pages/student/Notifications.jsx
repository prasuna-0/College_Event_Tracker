import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications for logged-in student
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5226/api/Notification", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationUserId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5226/api/Notification/mark-as-read/${notificationUserId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationUserId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Internal CSS
  const containerStyle = {
    padding: "20px",
    maxWidth: "600px",
    margin: "90px auto",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = (isRead) => ({
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "5px",
    backgroundColor: isRead ? "#e0e0e0" : "#f9f9f9",
  });

  const titleStyle = { margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" };
  const messageStyle = { margin: "0 0 5px 0", fontSize: "14px" };
  const dateStyle = { color: "#555", fontSize: "12px" };
  const headerStyle = { textAlign: "center", marginBottom: "20px" };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Notifications</h2>
      {notifications.length === 0 && <p>No notifications available.</p>}

      {notifications.map((notif) => (
        <div key={notif.id} style={cardStyle(notif.isRead)}>
          <h4 style={titleStyle}>{notif.notification.title}</h4>
          <p style={messageStyle}>{notif.notification.message}</p>
          <small style={dateStyle}>
            {new Date(notif.notification.createdAt).toLocaleString()}
          </small>
          {!notif.isRead && (
            <div>
              <button
                onClick={() => markAsRead(notif.id)}
                style={{
                 marginTop: "8px",
                padding: "5px 10px",
                marginLeft:"450px",
                fontSize: "12px",
                cursor: "pointer",
                backgroundColor:"blue",
                  color:"white",
                  borderRadius:"5px",
                  border:"none"
                }}
              >
                Mark as Read
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentNotifications;
