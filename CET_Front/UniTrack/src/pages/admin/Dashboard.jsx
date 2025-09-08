import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom";
import {
  faCalendar,
  faUsers,
  faDollarSign,
  faArrowUp,
  faPlus,
  faCog
} from "@fortawesome/free-solid-svg-icons"
import ShowEvents from "../../components/ShowEvents";

export default function AdminDashboard() {
const navigate = useNavigate();
  const stats = [
    {
      title: "Total Events",
      value: "24",
      icon: faCalendar,
      color: "#2563EB", 
    },
    {
      title: "Active Volunteers",
      value: "156",
      icon: faUsers,
      color: "#16A34A", 
    },
    {
      title: "Estimated Budget",
      value: "₹2,45,000",
      icon: faDollarSign,
      color: "#7C3AED", 
    },
    {
     title: "Utilized Budget",
      value: "₹2,45,000",
      icon: faDollarSign,
      color: "#7C3AED", 
    },
  ]

  return (
    <div className="manage">

    <div style={styles.container}>
      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
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
      <div style={styles.statsGrid} className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>{stat.title}</span>
              <FontAwesomeIcon icon={stat.icon} style={{ ...styles.statIcon, color: stat.color }} />
            </div>
            <div style={styles.cardContent}>
              <div style={styles.statValue}>{stat.value}</div>
            
            </div>
          </div>
        ))}
      </div>
    <ShowEvents/>
    </div>
</div>
  )
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#F9FAFB",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    color: "#4B5563",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
  },
  button: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: "#0c0c0cff",
    color: "white",
    border: "none",
  },
  outlineButton: {
    border: "1px solid #D1D5DB",
    backgroundColor: "white",
    color: "#111827",
  },
  icon: {
    marginRight: "6px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", 
    gap: "20px",
  },
  card: {
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "16px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4B5563",
  },
  statIcon: {
    fontSize: "16px",
  },
  cardContent: {},
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  statChange: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#16A34A",
    display: "flex",
    alignItems: "center",
  },
  changeIcon: {
    fontSize: "10px",
    marginRight: "4px",
  },
}

