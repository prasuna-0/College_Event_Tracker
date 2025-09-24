import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faCalendar, faUsers, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import ShowEvents from "../../components/ShowEvents";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [estimatedBudget, setEstimatedBudget] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5226/api/Events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    const fetchVolunteers = async () => {
      try {
        const res = await axios.get("http://localhost:5226/api/Volunteer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalVolunteers(res.data.length);
      } catch (err) {
        console.error("Failed to fetch volunteers:", err);
      }
    };

    const fetchBudgets = async () => {
      try {
        const res = await axios.get("http://localhost:5226/api/budget", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const budgets = res.data.data || [];
        const totalEstimated = budgets.reduce(
          (sum, b) => sum + parseFloat(b.estimatedAmount || 0),
          0
        );
        setEstimatedBudget(totalEstimated);
      } catch (err) {
        console.error("Failed to fetch budgets:", err);
        setEstimatedBudget(0);
      }
    };

    fetchEvents();
    fetchVolunteers();
    fetchBudgets();
  }, [token]);

  const stats = [
    { title: "Total Events", value: events.length, icon: faCalendar, color: "#2563EB" },
    { title: "Total Volunteers", value: totalVolunteers, icon: faUsers, color: "#16A34A" },
    { title: "Estimated Budget", value: `NRs ${estimatedBudget.toLocaleString()}`, icon: faDollarSign, color: "#7C3AED" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage events, budgets, reports and volunteers</p>
        </div>
        <div style={styles.buttonGroup}>
          <button
            onClick={() => navigate("/admin/create-event")}
            style={{ ...styles.button, ...styles.primaryButton }}
          >
            Create Event
          </button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.card} className="dashboard-card">
            <div style={styles.cardHeader}>
              <FontAwesomeIcon icon={stat.icon} style={{ ...styles.statIcon, color: stat.color }} />
              <span style={styles.cardTitle}>{stat.title}</span>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.statValue}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <ShowEvents />

      <style>{`
        .dashboard-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .dashboard-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    marginLeft: "250px",
    marginTop: "32px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#F3F4F6",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  title: { fontSize: "32px", fontWeight: "700", color: "#111827" },
  subtitle: { color: "#6B7280", fontSize: "16px" },
  buttonGroup: { display: "flex", gap: "12px" },
  button: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    fontSize: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    border: "none",
  },
  primaryButton: { backgroundColor: "#1F2937", color: "white" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginBottom: "40px",
  },
  card: {
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  cardTitle: { fontSize: "16px", fontWeight: "600", color: "#4B5563" },
  statIcon: { fontSize: "20px" },
  cardContent: {},
  statValue: { fontSize: "28px", fontWeight: "700", color: "#111827" },
};
