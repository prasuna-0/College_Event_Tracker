import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    buttonWrapper: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "25px",
    },
    buttonContainer: {
      display: "flex",
      gap: "15px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
    primaryButton: {
      backgroundColor: "#0e0e0eff",
      color: "white",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px",
    },
    card: {
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      padding: "25px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    title: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#555",
    },
    count: {
      fontSize: "36px",
      fontWeight: "bold",
      color: "#2563eb",
    },
  };

  return (
    <div className="manage">
      <div style={styles.container}>
        <div style={styles.buttonWrapper}>
          <div style={styles.buttonContainer}>
            <button
              onClick={() => navigate("/admin/create-volunteer")}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              Create Volunteer
            </button>
            <button
              onClick={() => navigate("/admin/create-team")}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              Create Team
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.title}>Total Volunteers</div>
            <div style={styles.count}>120</div>
          </div>
          <div style={styles.card}>
            <div style={styles.title}>Active Volunteers</div>
            <div style={styles.count}>85</div>
          </div>
          <div style={styles.card}>
            <div style={styles.title}>Total Teams</div>
            <div style={styles.count}>10</div>
          </div>
          <div style={styles.card}>
            <div style={styles.title}>Members in Teams</div>
            <div style={styles.count}>60</div>
          </div>
        </div>
      </div>
    </div>
  );
}




