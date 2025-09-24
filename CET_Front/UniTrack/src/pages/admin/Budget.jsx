

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Budget() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [newHeads, setNewHeads] = useState([{ name: "", allocatedAmount: "" }]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const apiBase = "http://localhost:5226/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${apiBase}/budget/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.data || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch events");
      }
    };
    fetchEvents();
  }, [token]);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(`${apiBase}/budget`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const withLiveHeads = res.data.data.map((b) => ({
        ...b,
        liveHeads: b.heads.map((h) => ({ ...h })),
      }));
      setBudgets(withLiveHeads);
    } catch (err) {
      console.error(err);
      setBudgets([]);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [token]);

  const handleNewHeadChange = (index, field, value) => {
    const updated = [...newHeads];
    updated[index][field] = value;
    setNewHeads(updated);
  };

  const addNewHead = () => setNewHeads([...newHeads, { name: "", allocatedAmount: "" }]);
  const removeNewHead = (index) => setNewHeads(newHeads.filter((_, i) => i !== index));

  const totalNewAllocated = newHeads.reduce(
    (sum, h) => sum + parseFloat(h.allocatedAmount || 0),
    0
  );

  const handleAllocateBudget = async (e) => {
    e.preventDefault();
    if (!selectedEvent) {
      setMessage("Select event");
      return;
    }
    if (totalNewAllocated === 0) {
      setMessage("Enter amounts for budget heads");
      return;
    }

    setLoading(true);
    try {
      const budgetRes = await axios.post(
        `${apiBase}/budget/allocate`,
        { eventId: parseInt(selectedEvent), estimatedAmount: totalNewAllocated },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const budgetId = budgetRes.data.data.id;

      for (const head of newHeads) {
        if (head.name && head.allocatedAmount) {
          await axios.post(
            `${apiBase}/budget/${budgetId}/heads`,
            { name: head.name, allocatedAmount: parseFloat(head.allocatedAmount) },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      setMessage("Budget allocated successfully!");
      setNewHeads([{ name: "", allocatedAmount: "" }]);
      setSelectedEvent("");
      fetchBudgets();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error allocating budget");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHead = async (headId, budgetId) => {
    try {
      await axios.delete(`${apiBase}/budget/heads/${headId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBudgets();
    } catch (err) {
      console.error(err);
      alert("Failed to delete head");
    }
  };

  const handleEditHead = async (budgetId, headId, name, allocatedAmount) => {
    const budget = budgets.find((b) => b.id === budgetId);
    const totalOtherHeads = budget.liveHeads
      .filter((h) => h.id !== headId)
      .reduce((sum, h) => sum + parseFloat(h.allocatedAmount || 0), 0);

    if (totalOtherHeads + parseFloat(allocatedAmount) > budget.estimatedAmount) {
      alert("Total allocated heads cannot exceed event estimated budget!");
      return;
    }

    try {
      await axios.put(
        `${apiBase}/budget/heads/${headId}`,
        { name, allocatedAmount: parseFloat(allocatedAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Dynamically update estimatedAmount locally
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === budgetId
            ? {
                ...b,
                liveHeads: b.liveHeads.map((h) =>
                  h.id === headId ? { ...h, name, allocatedAmount } : h
                ),
                estimatedAmount:
                  b.liveHeads
                    .map((h) => (h.id === headId ? parseFloat(allocatedAmount) : parseFloat(h.allocatedAmount)))
                    .reduce((a, c) => a + c, 0)
              }
            : b
        )
      );

      alert("Budget head updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update head");
    }
  };

  const handleLiveHeadChange = (budgetId, headId, field, value) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === budgetId
          ? {
              ...b,
              liveHeads: b.liveHeads.map((h) =>
                h.id === headId ? { ...h, [field]: value } : h
              ),
            }
          : b
      )
    );
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", marginTop: "70px" }}>
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          marginBottom: "30px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Allocate Budget</h2>

        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          style={{
            width: "90%",
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select Event</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title}
            </option>
          ))}
        </select>

        <h3>New Budget Heads</h3>
        {newHeads.map((head, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "5px", marginBottom: "5px", alignItems: "center" }}
          >
            <input
              type="text"
              placeholder="Head Name"
              value={head.name}
              onChange={(e) => handleNewHeadChange(index, "name", e.target.value)}
              style={{ flex: 2, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={head.allocatedAmount}
              onChange={(e) => handleNewHeadChange(index, "allocatedAmount", e.target.value)}
              style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              required
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeNewHead(index)}
                style={{ padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addNewHead}
          style={{
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Add Head
        </button>

        <button
          type="submit"
          disabled={loading}
          onClick={handleAllocateBudget}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Allocating..." : "Allocate Budget"}
        </button>

        {message && <p style={{ marginTop: "10px", color: "red" }}>{message}</p>}
      </div>

      {/* Existing Budgets */}
      {budgets.map(
        (budget) =>
          budget.liveHeads.length > 0 && (
            <div
              key={budget.id}
              style={{
                marginBottom: "30px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
                padding: "15px",
                width: "750px",
                marginLeft: "20px",
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#333" }}>
                Event: {budget.eventTitle} (Estimated: {budget.estimatedAmount})
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Budget Head</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.liveHeads.map((head) => (
                    <tr key={head.id}>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        <input
                          type="text"
                          value={head.name}
                          onChange={(e) =>
                            handleLiveHeadChange(budget.id, head.id, "name", e.target.value)
                          }
                          style={{ width: "90%", padding: "5px", borderRadius: "5px" }}
                        />
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        <input
                          type="number"
                          value={head.allocatedAmount}
                          onChange={(e) =>
                            handleLiveHeadChange(
                              budget.id,
                              head.id,
                              "allocatedAmount",
                              e.target.value
                            )
                          }
                          style={{ width: "90%", padding: "5px", borderRadius: "5px" }}
                        />
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        <button
                          onClick={() =>
                            handleEditHead(
                              budget.id,
                              head.id,
                              head.name,
                              head.allocatedAmount
                            )
                          }
                          style={{ marginRight: "5px", cursor: "pointer", padding: "5px 8px" }}
                        >
                          💾
                        </button>
                        <button
                          onClick={() => handleDeleteHead(head.id, budget.id)}
                          style={{ cursor: "pointer", padding: "5px 8px" }}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
      )}
    </div>
  );
}

