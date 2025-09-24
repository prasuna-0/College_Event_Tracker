import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Reports = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const printRef = useRef();

  const apiBase = "http://localhost:5226/api";
  const token = localStorage.getItem("token");

  const computeStatus = (actual, estimated) => {
    if (actual > estimated) return "Over Budget";
    if (actual < estimated) return "Under Budget";
    return "On Budget";
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${apiBase}/Events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch events ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getPieData = (estimated, actual) => ({
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [actual, estimated - actual > 0 ? estimated - actual : 0],
        backgroundColor: ["#ff6384", "#36a2eb"],
      },
    ],
  });

  const handlePrintClick = async (ev) => {
    try {
      const budgetRes = await axios.get(`${apiBase}/Budget/${ev.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const budget = budgetRes.data.data || {};
      const estimated = budget.estimatedAmount ?? 0;
      const actual = budget.actualAmount ?? 0;
      const remaining = estimated - actual;

      setSelectedEvent({
        ...ev,
        estimatedBudget: estimated,
        actualAmount: actual,
        remainingAmount: remaining > 0 ? remaining : 0,
        status: computeStatus(actual, estimated),
      });
      setShowPrintPreview(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch budget ❌");
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Event Report</title>
          <style>
            @media print {
              @page { size: A4; margin: 20mm; }
              body { font-family: 'Times New Roman', serif; color: #000; }
              header { text-align: center; margin-bottom: 20px; }
              header h1 { margin: 0; font-size: 24px; }
              header h2 { margin: 0; font-size: 16px; font-weight: normal; }
              h1, h2, h3, p { margin: 5px 0; }
              h1 { text-align: center; font-size: 22px; }
              h2 { font-size: 18px; margin-top: 20px; }
              .section { margin-bottom: 20px; }
              .pie-chart-container { width: 300px; height: 300px; margin: 20px auto; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <header>
            <h1>XYZ College</h1>
            <h2>Department of Student Affairs</h2>
            <h2>Official Event Report</h2>
          </header>
          ${printContents}
        </body>
      </html>
    `;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={{ padding: "20px", marginLeft: "120px", display: "flex", justifyContent: "center", marginTop: "35px" }}>
      <div style={{ width: "75%", maxWidth: "1000px" }}>
        <h1 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}>Events Report</h1>

        <table style={{ width: "100%", border: "1px solid #ccc", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Event Title</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Start Date</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? events.map((ev) => (
              <tr key={ev.id}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{ev.title}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>{ev.startDate ? new Date(ev.startDate).toLocaleDateString() : "N/A"}</td>
                <td style={{ padding: "10px", border: "1px solid #ccc", textAlign: "center" }}>
                  <button
                    style={{ backgroundColor: "#3f90adff", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    onClick={() => handlePrintClick(ev)}
                  >
                    Print Report
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "20px" }}>No events found</td>
              </tr>
            )}
          </tbody>
        </table>

        {showPrintPreview && selectedEvent && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 999 }}>
            <div ref={printRef} style={{ backgroundColor: "white",marginTop:"150px",marginLeft:"160px",marginBottom:"100px", borderRadius: "8px", width: "70%", maxHeight: "90vh", overflowY: "auto", padding: "20px" }}>
              
              <h1>Event Report</h1>
              
              <div className="section">
                <h2>Event Details</h2>
                <p><strong>Title:</strong> {selectedEvent.title}</p>
                <p><strong>Start Date:</strong> {selectedEvent.startDate ? new Date(selectedEvent.startDate).toLocaleDateString() : "N/A"}</p>
                <p><strong>End Date:</strong> {selectedEvent.endDate ? new Date(selectedEvent.endDate).toLocaleDateString() : "N/A"}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
              </div>

              <div className="section">
                <h2>Budget Summary</h2>
                <p><strong>Estimated Budget:</strong> Rs. {selectedEvent.estimatedBudget ?? 0}</p>
                <p><strong>Actual Expenditure:</strong> Rs. {selectedEvent.actualAmount ?? 0}</p>
                <p><strong>Remaining:</strong> Rs. {selectedEvent.remainingAmount ?? 0}</p>
                <p><strong>Status:</strong> {selectedEvent.status}</p>
              </div>

              <div className="section pie-chart-container" style={{ width: "300px", height: "300px", margin: "20px auto" }}>
                <Pie data={getPieData(selectedEvent.estimatedBudget, selectedEvent.actualAmount)} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button onClick={handlePrint} style={{ backgroundColor: "green", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Print</button>
                <button onClick={() => setShowPrintPreview(false)} style={{ backgroundColor: "red", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Close</button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
