// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const MultiTeamManager = () => {
//   const [teams, setTeams] = useState([]);
//   const [teamName, setTeamName] = useState("");
//   const [allVolunteers, setAllVolunteers] = useState([]);
//   const [message, setMessage] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [volRes, teamRes] = await Promise.all([
//           axios.get("http://localhost:5226/api/Volunteer", { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get("http://localhost:5226/api/Team", { headers: { Authorization: `Bearer ${token}` } })
//         ]);

//         setAllVolunteers(volRes.data);

//         const teamsWithVolunteers = teamRes.data.map(t => ({
//           ...t,
//           volunteers: t.teamVolunteers?.map(tv => ({
//             id: tv.volunteer.id,
//             sid: tv.volunteer.sid,
//             name: tv.volunteer.name
//           })) || []
//         }));

//         setTeams(teamsWithVolunteers);
//       } catch (err) {
//         console.error(err);
//         setMessage("Failed to fetch data ❌");
//       }
//     };
//     fetchData();
//   }, [token]);

//   const handleCreateTeam = async () => {
//     if (!teamName) return;
//     try {
//       const res = await axios.post(
//         "http://localhost:5226/api/Team",
//         { name: teamName },
//         { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
//       );
//       setTeams([...teams, { id: res.data.id, name: res.data.name, volunteers: [] }]);
//       setTeamName("");
//       setMessage(`Team "${res.data.name}" created ✅`);
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to create team ❌");
//     }
//   };

//   const handleDeleteTeam = async (teamId) => {
//     try {
//       await axios.delete(
//         `http://localhost:5226/api/Team/${teamId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setTeams(teams.filter((t) => t.id !== teamId));
//       setMessage("Team deleted ✅");
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to delete team ❌");
//     }
//   };

//   const handleAssign = async (teamId, volunteer) => {
//     try {
//       await axios.post(
//         `http://localhost:5226/api/Volunteer/${volunteer.id}/assign-team/${teamId}`,
//         null,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setTeams(
//         teams.map((team) =>
//           team.id === teamId
//             ? { ...team, volunteers: [...team.volunteers, volunteer] }
//             : team
//         )
//       );
//       setMessage(`Volunteer "${volunteer.name}" assigned ✅`);
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to assign volunteer ❌");
//     }
//   };

//   const handleUnassign = async (teamId, volunteerId) => {
//     try {
//       await axios.post(
//         `http://localhost:5226/api/Volunteer/${volunteerId}/unassign-team/${teamId}`,
//         null,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setTeams(
//         teams.map((team) =>
//           team.id === teamId
//             ? { ...team, volunteers: team.volunteers.filter((v) => v.id !== volunteerId) }
//             : team
//         )
//       );
//       setMessage("Volunteer unassigned ✅");
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to unassign volunteer ❌");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Multi-Team Volunteer Manager</h2>

//       <div style={styles.createTeamCard}>
//         <h3>Create Team</h3>
//         <input
//           type="text"
//           value={teamName}
//           onChange={(e) => setTeamName(e.target.value)}
//           placeholder="Enter team name"
//           style={styles.input}
//         />
//         <button onClick={handleCreateTeam} style={styles.createBtn}>
//           Create Team
//         </button>
//       </div>

//       {teams.map((team) => (
//         <div key={team.id} style={styles.card}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <h3>Team: {team.name}</h3>
//             <button
//               style={styles.deleteTeamBtn}
//               onClick={() => handleDeleteTeam(team.id)}
//             >
//               Delete Team
//             </button>
//           </div>

//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th>Volunteer ID</th>
//                 <th>Name</th>
//                 <th>Assign</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allVolunteers.map((v) => {
//                 const assigned = team.volunteers.some((tv) => tv.id === v.id);
//                 return (
//                   <tr key={v.id}>
//                     <td>{v.sid}</td>
//                     <td>{v.name}</td>
//                     <td>
//                       {!assigned && (
//                         <button
//                           style={styles.assignBtn}
//                           onClick={() => handleAssign(team.id, v)}
//                         >
//                           Assign
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           {team.volunteers.length > 0 && (
//             <>
//               <h4>Assigned Volunteers</h4>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th>Volunteer ID</th>
//                     <th>Name</th>
//                     <th>Unassign</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {team.volunteers.map((v) => (
//                     <tr key={v.id}>
//                       <td>{v.sid}</td>
//                       <td>{v.name}</td>
//                       <td>
//                         <button
//                           style={styles.unassignBtn}
//                           onClick={() => handleUnassign(team.id, v.id)}
//                         >
//                           Unassign
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </>
//           )}
//         </div>
//       ))}

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// const styles = {
//   container: { padding: "101px 75px", fontFamily:" Arial, sans-serif", /* margin: 95px 325px; */ marginLeft: "437px", width: "521px" },
//   createTeamCard: { backgroundColor: "#000", color: "#fff", padding: "15px", marginBottom: "20px", borderRadius: "8px" },
//   card: { border: "1px solid #ccc", padding: "15px", marginBottom: "20px", borderRadius: "8px" },
//   input: { marginRight: "10px", padding: "5px" },
//   createBtn: { padding: "5px 10px", cursor: "pointer", backgroundColor: "#333", color: "white", border: "none", borderRadius: "5px" },
//   deleteTeamBtn: { padding: "5px 10px", cursor: "pointer", backgroundColor: "darkred", color: "white", border: "none", borderRadius: "5px" },
//   table: { width: "100%", borderCollapse: "collapse", marginTop: "10px", textAlign: "center" },
//   assignBtn: { padding: "5px 10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
//   unassignBtn: { padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
// };

// export default MultiTeamManager;



import React, { useState, useEffect } from "react";
import axios from "axios";

const MultiTeamManager = () => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTeam, setActiveTeam] = useState(null); // team currently in modal

  const token = localStorage.getItem("token");

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

  const handleDeleteTeam = async (teamId) => {
    try {
      await axios.delete(`http://localhost:5226/api/Team/${teamId}`, { headers: { Authorization: `Bearer ${token}` } });
      setTeams(teams.filter(t => t.id !== teamId));
      setMessage("Team deleted ✅");
      if (activeTeam?.id === teamId) setActiveTeam(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete team ❌");
    }
  };

  const handleAssign = async (teamId, volunteer) => {
    try {
      await axios.post(
        `http://localhost:5226/api/Volunteer/${volunteer.id}/assign-team/${teamId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTeams = teams.map(team =>
        team.id === teamId
          ? { ...team, volunteers: [...team.volunteers, volunteer] }
          : team
      );
      setTeams(updatedTeams);

      if (activeTeam?.id === teamId) {
        setActiveTeam({
          ...activeTeam,
          volunteers: [...activeTeam.volunteers, volunteer],
        });
      }

      setMessage(`Volunteer "${volunteer.name}" assigned ✅`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to assign volunteer ❌");
    }
  };

  const handleUnassign = async (teamId, volunteerId) => {
    try {
      await axios.post(
        `http://localhost:5226/api/Volunteer/${volunteerId}/unassign-team/${teamId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTeams = teams.map(team =>
        team.id === teamId
          ? { ...team, volunteers: team.volunteers.filter(v => v.id !== volunteerId) }
          : team
      );
      setTeams(updatedTeams);

      if (activeTeam?.id === teamId) {
        setActiveTeam({
          ...activeTeam,
          volunteers: activeTeam.volunteers.filter(v => v.id !== volunteerId),
        });
      }

      setMessage("Volunteer unassigned ✅");
    } catch (err) {
      console.error(err);
      setMessage("Failed to unassign volunteer ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Multi-Team Volunteer Manager</h2>

      <div style={styles.createTeamCard}>
        <input
          type="text"
          placeholder="New Team Name"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleCreateTeam} style={styles.createBtn}>Create Team</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Volunteers Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id}>
              <td style={styles.centerCell}>{team.name}</td>
              <td style={styles.centerCell}>{team.volunteers.length}</td>
              <td style={styles.centerCell}>
                <button onClick={() => setActiveTeam(team)} style={styles.viewBtn}>View</button>
                <button onClick={() => handleDeleteTeam(team.id)} style={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {activeTeam && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>{activeTeam.name} - Volunteers</h3>
            <button style={styles.closeBtn} onClick={() => setActiveTeam(null)}>X</button>

            <h4>Assign Volunteers</h4>
            <select
              multiple
              style={styles.multiSelect}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(o => JSON.parse(o.value));
                selected.forEach(v => handleAssign(activeTeam.id, v));
              }}
            >
              {allVolunteers
                .filter(v => !activeTeam.volunteers.some(tv => tv.id === v.id))
                .map(v => (
                  <option key={v.id} value={JSON.stringify(v)}>
                    {v.name} 
                    
                  </option>
                ))}
            </select>

            {activeTeam.volunteers.length > 0 && (
              <>
                <h4>Assigned Volunteers</h4>
                <table style={styles.modalTable}>
                  <thead>
                    <tr>
                      <th style={styles.centerCell}>SID</th>
                      <th style={styles.centerCell}>Name</th>
                      <th style={styles.centerCell}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTeam.volunteers.map(v => (
                      <tr key={v.id}>
                        <td style={styles.centerCell}>{v.sid}</td>
                        <td style={styles.centerCell}>{v.name}</td>
                        <td style={styles.centerCell}>
                          <button onClick={() => handleUnassign(activeTeam.id, v.id)} style={styles.unassignBtn}>Unassign</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}

      {/* {message && <p>{message}</p>} */}
    </div>
  );
};

const styles = {
  container: { padding: "50px",
    marginTop: "100px",
    marginLeft: "256px", fontFamily: "Arial, sans-serif" },
  title: { marginBottom: "20px", textAlign: "center" },
  createTeamCard: { display: "flex", gap: "10px", marginBottom: "20px" },
  input: { flex: 1, padding: "5px" },
  createBtn: { padding: "5px 10px", cursor: "pointer", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "5px" },
  table: { width: "100%", borderCollapse: "collapse" },
  centerCell: { textAlign: "center", verticalAlign: "middle", padding: "8px", border: "1px solid #ccc" },
  viewBtn: { padding: "5px 10px", backgroundColor: "#0d6efd", color: "#fff", border: "none", borderRadius: "5px", marginRight: "5px", cursor: "pointer" },
  deleteBtn: { padding: "5px 10px", backgroundColor: "darkred", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { backgroundColor: "#fff", padding: "20px", borderRadius: "8px", minWidth: "400px", position: "relative" },
  closeBtn: { position: "absolute", top: "10px", right: "10px", cursor: "pointer", border: "none", background: "none", fontSize: "16px" },
  multiSelect: { width: "100%", height: "120px", marginBottom: "10px" },
  modalTable: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
  unassignBtn: { padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default MultiTeamManager;

