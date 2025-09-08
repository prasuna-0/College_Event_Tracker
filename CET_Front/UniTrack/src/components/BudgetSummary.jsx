import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5226/api/budget"; // your backend base URL

const BudgetSummary = ({ eventId, token }) => {
  const [budget, setBudget] = useState(null);
  const [allocateAmount, setAllocateAmount] = useState("");
  const [message, setMessage] = useState("");

  // Fetch budget summary
  const fetchBudget = async () => {
    try {
      const res = await axios.get(`${API_BASE}/${eventId}/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch budget summary.");
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  // Handle budget allocation
  const handleAllocate = async () => {
    if (!allocateAmount) {
      setMessage("Enter estimated amount first!");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/allocate`,
        {
          eventId: Number(eventId),
          estimatedAmount: Number(allocateAmount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Budget allocated successfully");
      setAllocateAmount("");
      fetchBudget();
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

  if (!budget) return <div>Loading budget...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Budget Summary</h2>
      {message && <p>{message}</p>}

      {!budget.estimatedAmount && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="number"
            placeholder="Enter estimated amount"
            value={allocateAmount}
            onChange={(e) => setAllocateAmount(e.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button onClick={handleAllocate}>Allocate Budget</button>
        </div>
      )}

      <div>
        <p>
          <strong>Estimated Amount:</strong> {budget.estimatedAmount}
        </p>
        <p>
          <strong>Actual Amount:</strong> {budget.actualAmount}
        </p>
        <p>
          <strong>Variance:</strong> {budget.actualAmount - budget.estimatedAmount}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {budget.actualAmount <= budget.estimatedAmount
            ? "Within Budget"
            : "Over Budget"}
        </p>
      </div>

      {budget.budgetHeads && budget.budgetHeads.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Budget Heads</h3>
          <table border="1" cellPadding="5" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Allocated Amount</th>
                <th>Actual Amount</th>
                <th>Variance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {budget.budgetHeads.map((head) => (
                <tr key={head.id}>
                  <td>{head.name}</td>
                  <td>{head.allocatedAmount}</td>
                  <td>{head.actualAmount}</td>
                  <td>{head.actualAmount - head.allocatedAmount}</td>
                  <td>
                    {head.actualAmount <= head.allocatedAmount
                      ? "Within Budget"
                      : "Over Budget"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {budget.expenses && budget.expenses.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Expenses</h3>
          <table border="1" cellPadding="5" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Notes</th>
                <th>Amount</th>
                <th>Spent On</th>
                <th>Budget Head</th>
              </tr>
            </thead>
            <tbody>
              {budget.expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>{exp.notes || "-"}</td>
                  <td>{exp.amount}</td>
                  <td>{new Date(exp.spentOn).toLocaleDateString()}</td>
                  <td>{exp.budgetHeadId || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BudgetSummary;
