


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaUsers, FaCheckCircle, FaTrophy } from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [activeVolunteers, setActiveVolunteers] = useState(0);
  const [totalTeams, setTotalTeams] = useState(0);
  const [membersInTeams, setMembersInTeams] = useState(0);

  const [hoverCard, setHoverCard] = useState(null); 

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [volRes, teamRes] = await Promise.all([
          axios.get("http://localhost:5226/api/Volunteer", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5226/api/Team", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const volunteers = volRes.data;
        const teams = teamRes.data;

        setTotalVolunteers(volunteers.length);
        setActiveVolunteers(volunteers.filter(v => v.isActive).length);
        setTotalTeams(teams.length);

        const membersCount = teams.reduce(
          (acc, team) => acc + (team.teamVolunteers?.length || 0),
          0
        );
        setMembersInTeams(membersCount);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      marginTop: "100px",
      marginLeft: "270px",
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
      transition: "0.3s",
    },
    primaryButton: {
      backgroundColor: "#0e0e0eff",
      color: "white",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "25px",
    },
    card: {
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
      textAlign: "center",
      transition: "0.3s",
      cursor: "pointer",
    },
    cardHoverEffect: {
      transform: "translateY(-8px) scale(1.05)",
      boxShadow: "0 12px 25px rgba(0,0,0,0.3)",
    },
    title: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#555",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    count: {
      fontSize: "36px",
      fontWeight: "bold",
      color: "#2563eb",
      marginTop: "10px",
    },
  };

  return (
    <div className="manage" style={styles.container}>
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
        {/* Total Volunteers */}
        <div
          style={{
            ...styles.card,
            ...(hoverCard === "totalVolunteers" ? styles.cardHoverEffect : {}),
          }}
          onMouseEnter={() => setHoverCard("totalVolunteers")}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div style={styles.title}>
            <FaUser color="#2563eb" /> Total Volunteers
          </div>
          <div style={styles.count}>{totalVolunteers}</div>
        </div>

        {/* Active Volunteers */}
        <div
          style={{
            ...styles.card,
            ...(hoverCard === "activeVolunteers" ? styles.cardHoverEffect : {}),
          }}
          onMouseEnter={() => setHoverCard("activeVolunteers")}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div style={styles.title}>
            <FaCheckCircle color="#16a34a" /> Active Volunteers
          </div>
          <div style={styles.count}>{activeVolunteers}</div>
        </div>

        {/* Total Teams */}
        <div
          style={{
            ...styles.card,
            ...(hoverCard === "totalTeams" ? styles.cardHoverEffect : {}),
          }}
          onMouseEnter={() => setHoverCard("totalTeams")}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div style={styles.title}>
            <FaTrophy color="#f59e0b" /> Total Teams
          </div>
          <div style={styles.count}>{totalTeams}</div>
        </div>

        {/* Members in Teams */}
        <div
          style={{
            ...styles.card,
            ...(hoverCard === "membersInTeams" ? styles.cardHoverEffect : {}),
          }}
          onMouseEnter={() => setHoverCard("membersInTeams")}
          onMouseLeave={() => setHoverCard(null)}
        >
          <div style={styles.title}>
            <FaUsers color="#d946ef" /> Members in Teams
          </div>
          <div style={styles.count}>{membersInTeams}</div>
        </div>
      </div>
    </div>
  );
}

