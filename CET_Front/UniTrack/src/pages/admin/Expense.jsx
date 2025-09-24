


import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Expense() {
  const [budgets, setBudgets] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); 
  const [message, setMessage] = useState("");

  const apiBase = "http://localhost:5226/api";
  const token = localStorage.getItem("token");

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(`${apiBase}/budget`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped = res.data.data.map((b) => ({
        ...b,
        liveHeads: b.heads?.map((h) => ({
          ...h,
          actualExpense: h.actualAmount ?? 0,
          saved: !!h.actualAmount, 
        })) ?? [],
      }));

      setBudgets(mapped);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch budgets.");
      setBudgets([]);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleHeadChange = (budgetId, headId, value) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === budgetId
          ? {
              ...b,
              liveHeads: b.liveHeads.map((h) =>
                h.id === headId ? { ...h, actualExpense: value } : h
              ),
            }
          : b
      )
    );
  };

  const handleSave = async (budgetId) => {
    setLoadingIds((prev) => [...prev, budgetId]);
    setMessage("");

    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) return;

    try {
      for (const head of budget.liveHeads) {
        if (head.id) {
          await axios.put(
            `${apiBase}/budget/heads/${head.id}`,
            {
              Name: head.name,
              AllocatedAmount: parseFloat(head.allocatedAmount) || 0,
              ActualAmount: parseFloat(head.actualExpense) || 0,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      alert(`Budget of "${budget.eventTitle}" updated successfully!`);

      setBudgets((prev) =>
        prev.map((b) =>
          b.id === budgetId
            ? {
                ...b,
                liveHeads: b.liveHeads.map((h) => ({
                  ...h,
                  actualExpense: parseFloat(h.actualExpense) || 0,
                  saved: true, 
                })),
              }
            : b
        )
      );
    } catch (err) {
      console.error(err.response || err);
      setMessage(`Failed to save budget "${budget.eventTitle}".`);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== budgetId));
    }
  };

  const getBudgetStatus = (estimated, actual) => {
    if (actual > estimated) return { text: "Over Budget", color: "red" };
    if (actual < estimated) return { text: "Under Budget", color: "green" };
    return { text: "On Budget", color: "orange" };
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", marginLeft: "150px" }}>
        Budget and Expense Management
      </h2>
      {budgets.length === 0 && <p style={{ textAlign: "center" }}>No budgets available.</p>}

      {budgets.map((budget) => {
        if (!budget.liveHeads || budget.liveHeads.length === 0) return null;

        const totalActual = budget.liveHeads.reduce(
          (sum, h) => sum + parseFloat(h.actualExpense || 0),
          0
        );

        const status = getBudgetStatus(budget.estimatedAmount, totalActual);
        const isLoading = loadingIds.includes(budget.id);

        return (
          <div
            key={budget.id}
            style={{
              marginBottom: "40px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              backgroundColor: "#fff",
              padding: "20px",
              maxWidth: "800px",
              marginLeft: "260px",
              marginRight: "auto",
              boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>
              Event: {budget.eventTitle} | Estimated: {budget.estimatedAmount} | Actual: {totalActual} |{" "}
              <span style={{ color: status.color, fontWeight: "bold" }}>{status.text}</span>
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px" }}>
              <thead>
                <tr style={{ background: "#f2f2f2" }}>
                  <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "8px", textAlign: "right" }}>Allocated</th>
                  <th style={{ padding: "8px", textAlign: "right" }}>Actual</th>
                </tr>
              </thead>
              <tbody>
                {budget.liveHeads.map((head) => (
                  <tr key={head.id}>
                    <td style={{ padding: "8px" }}>{head.name}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{head.allocatedAmount}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>
                      <input
                        type="number"
                        value={head.actualExpense}
                        onChange={(e) =>
                          handleHeadChange(budget.id, head.id, e.target.value)
                        }
                        disabled={head.saved} 
                        style={{
                          width: "80px",
                          padding: "4px",
                          textAlign: "right",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor: head.saved ? "#f0f0f0" : "white",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={() => handleSave(budget.id)}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#3f90adff",
                color: "white",
                fontWeight: "bold",
                fontSize: "15px",
                border: "none",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        );
      })}

      {message && <p style={{ textAlign: "center", marginTop: "20px", color: "green" }}>{message}</p>}
    </div>
  );
}
