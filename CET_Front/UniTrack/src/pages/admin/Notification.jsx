import React, { useState } from "react";

export default function AdminBroadcastNotification() {
  const [form, setForm] = useState({ title: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("Sending...");

  try {
    const res = await fetch("http://localhost:5226/api/Notification/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        title: form.title,
        message: form.message
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to broadcast");
    }

    setStatus("✅ Broadcast sent successfully!");
    setForm({ title: "", message: "" });
  } catch (err) {
    console.error(err);
    setStatus("❌ Error: " + err.message);
  }
};


  return (
    <div>
      <style>{`
        .form-container {
          max-width: 400px;
          margin: 100px auto;
          padding: 20px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }
        .form-container h2 {
          margin-bottom: 16px;
          font-size: 20px;
          font-weight: bold;
          text-align: center;
        }
        .form-container input,
        .form-container textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }
        .form-container button {
          width: 100%;
          padding: 10px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
          font-weight: bold;
        }
        .form-container button:hover {
          background: #1d4ed8;
        }
        .status {
          margin-top: 12px;
          text-align: center;
          font-size: 14px;
        }
      `}</style>

      <div className="form-container">
        <h2>Broadcast Notification (Admin)</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            rows="3"
            required
          />
          <button type="submit">Send to All Users</button>
        </form>
        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
}
