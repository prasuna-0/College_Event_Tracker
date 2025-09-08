import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5226/api/budget";

const AddExpenseForm = ({ eventId, token, onExpenseAdded }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!title || !amount) {
      setMessage("Title and Amount are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Amount", amount);

      const res = await axios.post(`${API_BASE}/${eventId}/expenses`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Expense added successfully!");
      onExpenseAdded(); // refresh parent state
      setTitle("");
      setAmount("");
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Internal server error";
      setMessage("❌ " + errMsg);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Add Expense</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount: </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;


