import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5226/api/budget";

const BudgetComparison = ({ eventId, token }) => {
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/${eventId}/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching budget summary");
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [eventId]);

  if (!summary) return <p>Loading summary...</p>;

  return (
    <div>
      <h3>Budget Summary</h3>
      {message && <p>{message}</p>}
      <p>
        Estimated Budget: {summary.estimatedAmount} <br />
        Actual Expenses: {summary.actualAmount} <br />
        Status: {summary.status}
      </p>
      <button onClick={fetchSummary}>Compare / Refresh</button>
    </div>
  );
};

export default BudgetComparison;
