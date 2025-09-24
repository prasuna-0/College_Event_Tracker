

//  import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminDashboard() {
//   const [events, setEvents] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingEvent, setEditingEvent] = useState(null);
//   const [addingEvent, setAddingEvent] = useState(false);
//   const [newEvent, setNewEvent] = useState({
//     title: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     eventStatus: "",
//     location: "",
//     faculty: "",
//     eventScope: "",
//     eventType: "",
//     objective: "",
//   });
//   const [teamDropdown, setTeamDropdown] = useState({}); 

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchEvents();
//     fetchTeams();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get("http://localhost:5226/api/Events", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (Array.isArray(response.data?.data)) {
//         // Compute status for each event
//         const updatedEvents = response.data.data.map((e) => ({
//           ...e,
//           eventStatus: computeStatus(e),
//         }));
//         setEvents(updatedEvents);
//       } else {
//         setEvents([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch events:", err);
//       alert("Failed to load events");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const fetchTeams = async () => {
//     try {
//       const res = await axios.get("http://localhost:5226/api/Team", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTeams(res.data);
//     } catch (err) {
//       console.error("Failed to fetch teams:", err);
//     }
//   };

//   // Compute event status based on dates
//   const computeStatus = (event) => {
//     if (event.eventStatus === "Cancelled") return "Cancelled";
//     const today = new Date();
//     const start = new Date(event.startDate);
//     const end = new Date(event.endDate);

//     if (end < today) return "Completed";
//     if (start <= today && today <= end) return "Ongoing";
//     return "Upcoming";
//   };

//   const handleAssignTeam = async (eventId, teamId) => {
//     if (!teamId) return;
//     try {
//       await axios.post(
//         `http://localhost:5226/api/Events/${eventId}/assign-team/${teamId}`,
//         null,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Team assigned ✅");
//       setEvents((prevEvents) =>
//         prevEvents.map((e) =>
//           e.id === eventId
//             ? { ...e, team: teams.find((t) => t.id === parseInt(teamId)) }
//             : e
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       alert("Failed to assign team ❌");
//     }
//   };

//   const handleUnassignTeam = async (eventId) => {
//     try {
//       await axios.delete(
//         `http://localhost:5226/api/Events/${eventId}/unassign-team`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Team unassigned ✅");
//       setEvents((prevEvents) =>
//         prevEvents.map((e) => (e.id === eventId ? { ...e, team: null } : e))
//       );
//     } catch (err) {
//       console.error(err);
//       alert("Failed to unassign team ❌");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this event?")) return;
//     try {
//       await axios.delete(`http://localhost:5226/api/Events/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEvents(events.filter((e) => e.id !== id));
//       alert("Event deleted successfully.");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete event ❌");
//     }
//   };

//   const handleEditClick = (event) => {
//     setEditingEvent({
//       ...event,
//       startDate: event.startDate ? event.startDate.substring(0, 16) : "",
//       endDate: event.endDate ? event.endDate.substring(0, 16) : "",
//     });
//   };

//   const handleUpdate = async (id) => {
//     if (!editingEvent) return;
//     try {
//       const payload = {
//         title: editingEvent.title,
//         description: editingEvent.description,
//         startDate: new Date(editingEvent.startDate).toISOString(),
//         endDate: new Date(editingEvent.endDate).toISOString(),
//         eventStatus: editingEvent.eventStatus,
//         location: editingEvent.location,
//         faculty: editingEvent.faculty,
//         eventScope: editingEvent.eventScope,
//         eventType: editingEvent.eventType,
//         objective: editingEvent.objective,
//       };
//       await axios.put(`http://localhost:5226/api/Events/${id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Event updated ✅");
//       setEditingEvent(null);
//       fetchEvents();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update event ❌");
//     }
//   };

//   const handleAdd = async () => {
//     try {
//       const payload = {
//         ...newEvent,
//         startDate: new Date(newEvent.startDate).toISOString(),
//         endDate: new Date(newEvent.endDate).toISOString(),
//       };
//       await axios.post("http://localhost:5226/api/Events", payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Event added ✅");
//       setNewEvent({
//         title: "",
//         description: "",
//         startDate: "",
//         endDate: "",
//         eventStatus: "",
//         location: "",
//         faculty: "",
//         eventScope: "",
//         eventType: "",
//         objective: "",
//       });
//       setAddingEvent(false);
//       fetchEvents();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add event ❌");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>Admin Dashboard - Events</h1>

//       {addingEvent && (
//         <div style={styles.form}>
//           {Object.keys(newEvent).map((key) => (
//             <input
//               key={key}
//               type={key.includes("Date") ? "datetime-local" : "text"}
//               placeholder={key}
//               value={newEvent[key]}
//               onChange={(e) => setNewEvent({ ...newEvent, [key]: e.target.value })}
//               style={styles.input}
//             />
//           ))}
//           <button onClick={handleAdd} style={styles.submitButton}>
//             Save Event
//           </button>
//         </div>
//       )}

//       {editingEvent && (
//         <div style={styles.form}>
//           {Object.keys(editingEvent)
//             .filter((key) => key !== "id")
//             .map((key) => (
//               <input
//                 key={key}
//                 type={key.includes("Date") ? "datetime-local" : "text"}
//                 placeholder={key}
//                 value={editingEvent[key]}
//                 onChange={(e) =>
//                   setEditingEvent({ ...editingEvent, [key]: e.target.value })
//                 }
//                 style={styles.input}
//               />
//             ))}
//           <button onClick={() => handleUpdate(editingEvent.id)} style={styles.submitButton}>
//             Update Event
//           </button>
//           <button onClick={() => setEditingEvent(null)} style={styles.cancelButton}>
//             Cancel
//           </button>
//         </div>
//       )}

//       {loading ? (
//         <p>Loading events...</p>
//       ) : events.length === 0 ? (
//         <p>No events found.</p>
//       ) : (
//         events.map((event) => (
//           <div key={event.id} style={styles.card}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <h2 style={styles.title}>{event.title}</h2>
//               <div>
//                 {event.team ? (
//                   <>
//                     <span style={styles.assignedLabel}>Team Assigned: {event.team.name}</span>
//                     <button style={styles.unassignButton} onClick={() => handleUnassignTeam(event.id)}>Unassign</button>
//                   </>
//                 ) : (
//                   <>
//                     <span style={styles.notAssignedLabel}>Not Assigned</span>
//                     <select
//                       style={styles.teamDropdown}
//                       value={teamDropdown[event.id] || ""}
//                       onChange={(e) =>
//                         setTeamDropdown({ ...teamDropdown, [event.id]: e.target.value })
//                       }
//                     >
//                       <option value="">Select Team</option>
//                       {teams.map((t) => (
//                         <option key={t.id} value={t.id}>{t.name}</option>
//                       ))}
//                     </select>
//                     <button
//                       style={styles.assignButton}
//                       onClick={() => handleAssignTeam(event.id, teamDropdown[event.id])}
//                       disabled={!teamDropdown[event.id]}
//                     >
//                       Assign Team
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>

//             <p>{event.description}</p>
//             <p><strong>Start:</strong> {event.startDate ? new Date(event.startDate).toLocaleString() : "N/A"}</p>
//             <p><strong>End:</strong> {event.endDate ? new Date(event.endDate).toLocaleString() : "N/A"}</p>
//             <p><strong>Status:</strong> {event.eventStatus}</p>
//             <p><strong>Location:</strong> {event.location}</p>
//             <p><strong>Faculty:</strong> {event.faculty}</p>
//             <p><strong>Scope:</strong> {event.eventScope}</p>
//             <p><strong>Type:</strong> {event.eventType}</p>
//             <p><strong>Objective:</strong> {event.objective}</p>
//             <div>
//               <button onClick={() => handleEditClick(event)} style={styles.editButton}>Edit</button>
//               <button onClick={() => handleDelete(event.id)} style={styles.deleteButton}>Delete</button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// const styles = {
//   container: { maxWidth: "1000px", margin: "50px auto", padding: "20px", fontFamily: "Arial" },
//   heading: { textAlign: "center", fontSize: "28px", marginBottom: "20px" },
//   card: { border: "1px solid #ddd", borderRadius: "10px", padding: "15px", marginBottom: "15px", backgroundColor: "#f9f9f9" },
//   title: { fontSize: "20px", color: "#2563eb" },
//   form: { border: "1px solid #ccc", padding: "15px", marginBottom: "20px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" },
//   input: { padding: "6px 10px", borderRadius: "4px", border: "1px solid #aaa" },
//   submitButton: { padding: "8px 12px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
//   cancelButton: { padding: "8px 12px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "5px" },
//   editButton: { padding: "6px 10px", backgroundColor: "#2196f3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "5px" },
//   deleteButton: { padding: "6px 10px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
//   assignedLabel: { color: "green", fontWeight: "bold", marginRight: "10px" },
//   notAssignedLabel: { color: "red", fontWeight: "bold", marginRight: "10px" },
//   teamDropdown: { padding: "5px", borderRadius: "4px", marginRight: "5px" },
//   assignButton: { padding: "5px 10px", borderRadius: "4px", backgroundColor: "#2563eb", color: "#fff", border: "none", cursor: "pointer" },
//   unassignButton: { padding: "5px 10px", borderRadius: "4px", backgroundColor: "#f44336", color: "#fff", border: "none", cursor: "pointer", marginLeft: "5px" },
// };




import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewEvent, setViewEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [teamDropdown, setTeamDropdown] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
    fetchTeams();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5226/api/Events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data?.data)) {
        const updatedEvents = res.data.data.map((e) => ({
          ...e,
          eventStatus: computeStatus(e),
        }));
        setEvents(updatedEvents);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch events ❌");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:5226/api/Team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  const computeStatus = (event) => {
    if (event.eventStatus === "Cancelled") return "Cancelled";
    const today = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    if (end < today) return "Completed";
    if (start <= today && today <= end) return "Ongoing";
    return "Upcoming";
  };

  const statusColors = {
    Upcoming: "#2563EB",
    Ongoing: "#16A34A",
    Completed: "#7C3AED",
    Cancelled: "#DC2626",
  };

  const handleEditClick = (event) => {
    setEditingEvent({
      ...event,
      startDate: event.startDate ? event.startDate.substring(0, 16) : "",
      endDate: event.endDate ? event.endDate.substring(0, 16) : "",
    });
    setViewEvent(event);
  };

  const handleUpdate = async (id) => {
    try {
      const payload = {
        ...editingEvent,
        startDate: new Date(editingEvent.startDate).toISOString(),
        endDate: new Date(editingEvent.endDate).toISOString(),
      };
      await axios.put(`http://localhost:5226/api/Events/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event updated ✅");
      setEditingEvent(null);
      setViewEvent(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to update ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5226/api/Events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e.id !== id));
      setViewEvent(null);
      alert("Event deleted ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to delete ❌");
    }
  };

  const handleAssignTeam = async (eventId, teamId) => {
    if (!teamId) return;
    try {
      await axios.post(
        `http://localhost:5226/api/Events/${eventId}/assign-team/${teamId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Team assigned ✅");
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, team: teams.find((t) => t.id === +teamId) } : e
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to assign team ❌");
    }
  };

  const handleUnassignTeam = async (eventId) => {
    try {
      await axios.delete(
        `http://localhost:5226/api/Events/${eventId}/unassign-team`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Team unassigned ✅");
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, team: null } : e))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to unassign team ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Dashboard - Events</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td style={styles.centerCell}>{e.title}</td>
                <td style={styles.centerCell}>
                  {e.startDate ? new Date(e.startDate).toLocaleString() : "N/A"}
                </td>
                <td style={{ ...styles.centerCell, color: statusColors[e.eventStatus] }}>
                  {e.eventStatus}
                </td>
                <td style={styles.centerCell}>
                  <button style={styles.viewButton} onClick={() => setViewEvent(e)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {viewEvent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {editingEvent ? (
              <>
                <h2>Edit Event</h2>
                {Object.keys(editingEvent)
                  .filter((k) => k !== "id" && k !== "team")
                  .map((key) => (
                    <div style={styles.inputRow} key={key}>
                      <label style={styles.inputLabel}>{key}</label>
                      <input
                        type={key.includes("Date") ? "datetime-local" : "text"}
                        value={editingEvent[key] || ""}
                        onChange={(e) =>
                          setEditingEvent({ ...editingEvent, [key]: e.target.value })
                        }
                        style={styles.inputField}
                      />
                    </div>
                  ))}
                <div style={{ textAlign: "right" }}>
                  <button
                    style={styles.submitButton}
                    onClick={() => handleUpdate(editingEvent.id)}
                  >
                    Save
                  </button>
                  <button
                    style={styles.cancelButton}
                    onClick={() => setEditingEvent(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>{viewEvent.title}</h2>
                <p><strong>Description:</strong> {viewEvent.description}</p>
                <p><strong>Start:</strong> {viewEvent.startDate ? new Date(viewEvent.startDate).toLocaleString() : "N/A"}</p>
                <p><strong>End:</strong> {viewEvent.endDate ? new Date(viewEvent.endDate).toLocaleString() : "N/A"}</p>
                <p><strong>Status:</strong> {viewEvent.eventStatus}</p>
                <p><strong>Location:</strong> {viewEvent.location}</p>
                <p><strong>Faculty:</strong> {viewEvent.faculty}</p>
                <p><strong>Scope:</strong> {viewEvent.eventScope}</p>
                <p><strong>Type:</strong> {viewEvent.eventType}</p>
                <p><strong>Objective:</strong> {viewEvent.objective}</p>
                <p>
                  <strong>Team:</strong>{" "}
                  {viewEvent.team ? (
                    <>
                      {viewEvent.team.name}
                      <button
                        style={styles.unassignButton}
                        onClick={() => handleUnassignTeam(viewEvent.id)}
                      >
                        Unassign
                      </button>
                    </>
                  ) : (
                    <>
                      <select
                        style={styles.teamDropdown}
                        value={teamDropdown[viewEvent.id] || ""}
                        onChange={(e) =>
                          setTeamDropdown({
                            ...teamDropdown,
                            [viewEvent.id]: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Team</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <button
                        style={styles.assignButton}
                        disabled={!teamDropdown[viewEvent.id]}
                        onClick={() =>
                          handleAssignTeam(viewEvent.id, teamDropdown[viewEvent.id])
                        }
                      >
                        Assign
                      </button>
                    </>
                  )}
                </p>
                <div style={{ textAlign: "right" }}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEditClick(viewEvent)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(viewEvent.id)}
                  >
                    Delete
                  </button>
                  <button
                    style={styles.closeButton}
                    onClick={() => setViewEvent(null)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "1000px", margin: "50px auto", padding: "20px", fontFamily: "Arial, sans-serif" },
  heading: { textAlign: "center", fontSize: "28px", marginBottom: "20px", color: "#000000ff" },
  table: { width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  centerCell: { textAlign: "center", padding: "12px" },
  viewButton: { padding: "6px 12px", backgroundColor: "#16A34A", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { backgroundColor: "#fff", padding: "20px", borderRadius: "8px", width: "500px", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
  closeButton: { marginTop: "10px", padding: "6px 12px", backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginLeft: "5px" },
  editButton: { padding: "6px 12px", backgroundColor: "#2196F3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" },
  deleteButton: { padding: "6px 12px", backgroundColor: "#F44336", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" },
  submitButton: { padding: "6px 12px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" },
  cancelButton: { padding: "6px 12px", backgroundColor: "#F44336", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" },
  assignButton: { padding: "4px 8px", borderRadius: "4px", backgroundColor: "#2563EB", color: "#fff", border: "none", cursor: "pointer", marginLeft: "5px" },
  unassignButton: { padding: "4px 8px", borderRadius: "4px", backgroundColor: "#F44336", color: "#fff", border: "none", cursor: "pointer", marginLeft: "5px" },
  teamDropdown: { padding: "5px", borderRadius: "4px" },
  inputRow: { display: "flex", marginBottom: "8px", alignItems: "center" },
  inputLabel: { flex: "1", marginRight: "10px", fontWeight: "bold" },
  inputField: { flex: "2", padding: "6px 10px", borderRadius: "4px", border: "1px solid #aaa" },
};
