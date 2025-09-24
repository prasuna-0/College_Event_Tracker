


import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminBroadcastNotification() {
  const [form, setForm] = useState({ title: "", message: "" });
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [roleOptions, setRoleOptions] = useState({
    Students: false,
    Coordinators: false,
    Volunteers: false,
    All: false,
    Individual: false,
  });
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5226/api/User", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setStatus("❌ Error fetching users: " + err.message);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleCheckboxChange = (role) => {
    setRoleOptions((prev) => ({ ...prev, [role]: !prev[role] }));
    if (role !== "Individual") setSelectedUsers([]); 
  };

  const handleUserSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    setStatus("Sending...");
    const token = localStorage.getItem("token");

    try {
      // sending to individual users
      if (roleOptions.Individual && selectedUsers.length > 0) {
        await axios.post(
          "http://localhost:5226/api/Notification/send-to-selected",
          { title: form.title, message: form.message, userIds: selectedUsers },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatus(`✅ Notification sent to ${selectedUsers.length} user(s).`);
      } else {
        // Role-based sending
        const roles = ["Students", "Coordinators", "Volunteers", "All"];
        for (const roleKey of roles) {
          if (roleOptions[roleKey]) {
            const roleName =
              roleKey === "All" ? "All" : roleKey.slice(0, -1); 
            if (roleName === "All") {
              for (const r of ["Student", "Coordinator", "Volunteer"]) {
                await axios.post(
                  "http://localhost:5226/api/Notification/broadcast-to-role",
                  { role: r, title: form.title, message: form.message },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              }
              setStatus("✅ Notification sent to all users.");
            } else {
              await axios.post(
                "http://localhost:5226/api/Notification/broadcast-to-role",
                { role: roleName, title: form.title, message: form.message },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setStatus(`✅ Notification sent to ${roleName}s.`);
            }
          }
        }
      }

      // Reset form
      setForm({ title: "", message: "" });
      setRoleOptions({ Students: false, Coordinators: false, Volunteers: false, All: false, Individual: false });
      setSelectedUsers([]);
    } catch (err) {
      console.error(err);
      setStatus("❌ Error sending notification: " + err.message);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "40px" ,marginTop:"70px"}}>
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Broadcast Notification</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
          }}
        />
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          rows="4"
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
          }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
          {[ "Students", "Coordinators", "Individual"].map((role) => (
            <label
              key={role}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: roleOptions[role] ? "#2563eb" : "#f0f0f0",
                color: roleOptions[role] ? "white" : "black",
                padding: "10px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                userSelect: "none",
                fontWeight: "bold",
              }}
            >
              <input
                type="checkbox"
                checked={roleOptions[role]}
                onChange={() => handleRoleCheckboxChange(role)}
                style={{ cursor: "pointer" }}
              />
              {role === "All" ? "Send to All Users" : role === "Individual" ? "Send to Individual Users" : `Send to ${role}`}
            </label>
          ))}
        </div>

        {roleOptions.Individual && (
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            {users.map((user) => (
              <label key={user.id} style={{ display: "flex", alignItems: "center", marginBottom: "8px", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserSelect(user.id)}
                />
                {user.username} ({user.role})
              </label>
            ))}
          </div>
        )}

        <button
          onClick={handleSend}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#3f90adff",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          Send Notification
        </button>

        {status && (
          <p style={{ textAlign: "center", marginTop: "15px", fontWeight: "bold" }}>{status}</p>
        )}
      </div>
    </div>
  );
}
