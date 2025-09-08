import React, { useState, useEffect } from "react";
import axios from "axios";

const MultiTeamManager = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all volunteers and teams on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [volRes, teamRes] = await Promise.all([
          axios.get("http://localhost:5226/api/Volunteer", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:5226/api/Team", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setAllVolunteers(volRes.data);

        const teamsWithVolunteers = teamRes.data.map(t => ({
          ...t,
          volunteers: t.teamVolunteers?.map(tv => ({
            id: tv.volunteer.id,
            sid: tv.volunteer.sid,
            name: tv.volunteer.name
          })) || []
        }));

        setTeams(teamsWithVolunteers);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch data ❌");
      }
    };
    fetchData();
  }, [token]);

  // Create new team
  const handleCreateTeam = async () => {
    if (!teamName) return;
    try {
      const res = await axios.post(
        "http://localhost:5226/api/Team",
        { name: teamName },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setTeams([...teams, { id: res.data.id, name: res.data.name, volunteers: [] }]);
      setTeamName("");
      setMessage(`Team "${res.data.name}" created ✅`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create team ❌");
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId) => {
    try {
      await axios.delete(
        `http://localhost:5226/api/Team/${teamId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams(teams.filter((t) => t.id !== teamId));
      setMessage("Team deleted ✅");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete team ❌");
    }
  };

  // Assign volunteer
  const handleAssign = async (teamId, volunteer) => {
    try {
      await axios.post(
        `http://localhost:5226/api/Volunteer/${volunteer.id}/assign-team/${teamId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams(
        teams.map((team) =>
          team.id === teamId
            ? { ...team, volunteers: [...team.volunteers, volunteer] }
            : team
        )
      );
      setMessage(`Volunteer "${volunteer.name}" assigned ✅`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to assign volunteer ❌");
    }
  };

  // Unassign volunteer
  const handleUnassign = async (teamId, volunteerId) => {
    try {
      await axios.post(
        `http://localhost:5226/api/Volunteer/${volunteerId}/unassign-team/${teamId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams(
        teams.map((team) =>
          team.id === teamId
            ? { ...team, volunteers: team.volunteers.filter((v) => v.id !== volunteerId) }
            : team
        )
      );
      setMessage("Volunteer unassigned ✅");
    } catch (err) {
      console.error(err);
      setMessage("Failed to unassign volunteer ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Multi-Team Volunteer Manager</h2>

      {/* Create Team Form */}
      <div style={styles.createTeamCard}>
        <h3>Create Team</h3>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          style={styles.input}
        />
        <button onClick={handleCreateTeam} style={styles.createBtn}>
          Create Team
        </button>
      </div>

      {/* Teams List */}
      {teams.map((team) => (
        <div key={team.id} style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Team: {team.name}</h3>
            <button
              style={styles.deleteTeamBtn}
              onClick={() => handleDeleteTeam(team.id)}
            >
              Delete Team
            </button>
          </div>

          {/* All volunteers list with Assign button */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Volunteer ID</th>
                <th>Name</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {allVolunteers.map((v) => {
                const assigned = team.volunteers.some((tv) => tv.id === v.id);
                return (
                  <tr key={v.id}>
                    <td>{v.sid}</td>
                    <td>{v.name}</td>
                    <td>
                      {!assigned && (
                        <button
                          style={styles.assignBtn}
                          onClick={() => handleAssign(team.id, v)}
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Assigned volunteers with Unassign button */}
          {team.volunteers.length > 0 && (
            <>
              <h4>Assigned Volunteers</h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Volunteer ID</th>
                    <th>Name</th>
                    <th>Unassign</th>
                  </tr>
                </thead>
                <tbody>
                  {team.volunteers.map((v) => (
                    <tr key={v.id}>
                      <td>{v.sid}</td>
                      <td>{v.name}</td>
                      <td>
                        <button
                          style={styles.unassignBtn}
                          onClick={() => handleUnassign(team.id, v.id)}
                        >
                          Unassign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      ))}

      {message && <p>{message}</p>}
    </div>
  );
};

// Internal CSS
const styles = {
  container: { padding: "101px 75px", fontFamily:" Arial, sans-serif", /* margin: 95px 325px; */ marginLeft: "437px", width: "521px" },
  createTeamCard: { backgroundColor: "#000", color: "#fff", padding: "15px", marginBottom: "20px", borderRadius: "8px" },
  card: { border: "1px solid #ccc", padding: "15px", marginBottom: "20px", borderRadius: "8px" },
  input: { marginRight: "10px", padding: "5px" },
  createBtn: { padding: "5px 10px", cursor: "pointer", backgroundColor: "#333", color: "white", border: "none", borderRadius: "5px" },
  deleteTeamBtn: { padding: "5px 10px", cursor: "pointer", backgroundColor: "darkred", color: "white", border: "none", borderRadius: "5px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "10px", textAlign: "center" },
  assignBtn: { padding: "5px 10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  unassignBtn: { padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default MultiTeamManager;
