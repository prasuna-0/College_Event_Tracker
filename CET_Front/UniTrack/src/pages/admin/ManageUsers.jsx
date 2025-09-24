
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const apiBase = "http://localhost:5226/api/User";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // ✅ pending users
      const pendingRes = await axios.get(`${apiBase}/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingUsers(pendingRes.data || []);

      // ✅ all users
      const allRes = await axios.get(apiBase, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(allRes.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.put(
        `${apiBase}/approve/${userId}?approve=true`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User approved successfully!");
      fetchUsers();
    } catch (err) {
      alert("Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.put(
        `${apiBase}/approve/${userId}?approve=false`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User rejected successfully!");
      fetchUsers();
    } catch (err) {
      alert("Failed to reject user");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Users</h1>

      {loading && <p>Loading users...</p>}

      {/* Pending Users */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Pending Users</h2>
        {pendingUsers.length === 0 ? (
          <p style={styles.emptyText}>No pending users</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.button, ...styles.acceptBtn }}
                      onClick={() => handleApprove(user.id)}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.rejectBtn }}
                      onClick={() => handleReject(user.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All Users */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>All Users</h2>
        {allUsers.length === 0 ? (
          <p style={styles.emptyText}>No users found</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Approved</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>
                    {user.isApproved ? "✅ Yes" : "❌ No"}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    marginLeft: "250px",
    marginTop: "32px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#F9FAFB",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    marginTop:"40px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#111827",
  },
  section: {
    marginBottom: "40px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#374151",
  },
  emptyText: {
    fontSize: "14px",
    color: "#6B7280",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "10px",
    backgroundColor: "#F3F4F6",
    fontSize: "14px",
    fontWeight: "600",
    borderBottom: "2px solid #E5E7EB",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #E5E7EB",
    fontSize: "14px",
    color: "#111827",
  },
  button: {
    padding: "6px 12px",
    fontSize: "13px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
    fontWeight: "600",
  },
  acceptBtn: {
    backgroundColor: "#16A34A",
    color: "white",
  },
  rejectBtn: {
    backgroundColor: "#DC2626",
    color: "white",
  },
};

