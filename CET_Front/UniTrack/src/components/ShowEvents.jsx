import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [addingEvent, setAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    eventStatus: "",
    location: "",
    faculty: "",
    eventScope: "",
    eventType: "",
    objective: "",
  });
  const [teamDropdown, setTeamDropdown] = useState({}); 

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
    fetchTeams();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5226/api/Events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      alert("Failed to load events");
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

  const handleAssignTeam = async (eventId, teamId) => {
    if (!teamId) return;
    try {
      await axios.post(
        `http://localhost:5226/api/Events/${eventId}/assign-team/${teamId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Team assigned ✅");
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === eventId
            ? { ...e, team: teams.find((t) => t.id === parseInt(teamId)) }
            : e
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
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.id === eventId ? { ...e, team: null } : e))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to unassign team ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5226/api/Events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e.id !== id));
      alert("Event deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event ❌");
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent({
      ...event,
      startDate: event.startDate ? event.startDate.substring(0, 16) : "",
      endDate: event.endDate ? event.endDate.substring(0, 16) : "",
    });
  };

  const handleUpdate = async (id) => {
    if (!editingEvent) return;
    try {
      const payload = {
        title: editingEvent.title,
        description: editingEvent.description,
        startDate: new Date(editingEvent.startDate).toISOString(),
        endDate: new Date(editingEvent.endDate).toISOString(),
        eventStatus: editingEvent.eventStatus,
        location: editingEvent.location,
        faculty: editingEvent.faculty,
        eventScope: editingEvent.eventScope,
        eventType: editingEvent.eventType,
        objective: editingEvent.objective,
      };
      await axios.put(`http://localhost:5226/api/Events/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event updated ✅");
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to update event ❌");
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...newEvent,
        startDate: new Date(newEvent.startDate).toISOString(),
        endDate: new Date(newEvent.endDate).toISOString(),
      };
      await axios.post("http://localhost:5226/api/Events", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event added ✅");
      setNewEvent({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        eventStatus: "",
        location: "",
        faculty: "",
        eventScope: "",
        eventType: "",
        objective: "",
      });
      setAddingEvent(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to add event ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Dashboard - Events</h1>

      {addingEvent && (
        <div style={styles.form}>
          {Object.keys(newEvent).map((key) => (
            <input
              key={key}
              type={key.includes("Date") ? "datetime-local" : "text"}
              placeholder={key}
              value={newEvent[key]}
              onChange={(e) => setNewEvent({ ...newEvent, [key]: e.target.value })}
              style={styles.input}
            />
          ))}
          <button onClick={handleAdd} style={styles.submitButton}>
            Save Event
          </button>
        </div>
      )}

      {editingEvent && (
        <div style={styles.form}>
          {Object.keys(editingEvent)
            .filter((key) => key !== "id")
            .map((key) => (
              <input
                key={key}
                type={key.includes("Date") ? "datetime-local" : "text"}
                placeholder={key}
                value={editingEvent[key]}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, [key]: e.target.value })
                }
                style={styles.input}
              />
            ))}
          <button onClick={() => handleUpdate(editingEvent.id)} style={styles.submitButton}>
            Update Event
          </button>
          <button onClick={() => setEditingEvent(null)} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={styles.title}>{event.title}</h2>
              <div>
                {event.team ? (
                  <>
                    <span style={styles.assignedLabel}>Team Assigned: {event.team.name}</span>
                    <button style={styles.unassignButton} onClick={() => handleUnassignTeam(event.id)}>Unassign</button>
                  </>
                ) : (
                  <>
                    <span style={styles.notAssignedLabel}>Not Assigned</span>
                    <select
                      style={styles.teamDropdown}
                      value={teamDropdown[event.id] || ""}
                      onChange={(e) =>
                        setTeamDropdown({ ...teamDropdown, [event.id]: e.target.value })
                      }
                    >
                      <option value="">Select Team</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <button
                      style={styles.assignButton}
                      onClick={() => handleAssignTeam(event.id, teamDropdown[event.id])}
                      disabled={!teamDropdown[event.id]}
                    >
                      Assign Team
                    </button>
                  </>
                )}
              </div>
            </div>

            <p>{event.description}</p>
            <p><strong>Start:</strong> {event.startDate ? new Date(event.startDate).toLocaleString() : "N/A"}</p>
            <p><strong>End:</strong> {event.endDate ? new Date(event.endDate).toLocaleString() : "N/A"}</p>
            <p><strong>Status:</strong> {event.eventStatus}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Faculty:</strong> {event.faculty}</p>
            <p><strong>Scope:</strong> {event.eventScope}</p>
            <p><strong>Type:</strong> {event.eventType}</p>
            <p><strong>Objective:</strong> {event.objective}</p>
            <div>
              <button onClick={() => handleEditClick(event)} style={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(event.id)} style={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "1000px", margin: "50px auto", padding: "20px", fontFamily: "Arial" },
  heading: { textAlign: "center", fontSize: "28px", marginBottom: "20px" },
  card: { border: "1px solid #ddd", borderRadius: "10px", padding: "15px", marginBottom: "15px", backgroundColor: "#f9f9f9" },
  title: { fontSize: "20px", color: "#2563eb" },
  form: { border: "1px solid #ccc", padding: "15px", marginBottom: "20px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" },
  input: { padding: "6px 10px", borderRadius: "4px", border: "1px solid #aaa" },
  submitButton: { padding: "8px 12px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  cancelButton: { padding: "8px 12px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "5px" },
  editButton: { padding: "6px 10px", backgroundColor: "#2196f3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "5px" },
  deleteButton: { padding: "6px 10px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  assignedLabel: { color: "green", fontWeight: "bold", marginRight: "10px" },
  notAssignedLabel: { color: "red", fontWeight: "bold", marginRight: "10px" },
  teamDropdown: { padding: "5px", borderRadius: "4px", marginRight: "5px" },
  assignButton: { padding: "5px 10px", borderRadius: "4px", backgroundColor: "#2563eb", color: "#fff", border: "none", cursor: "pointer" },
  unassignButton: { padding: "5px 10px", borderRadius: "4px", backgroundColor: "#f44336", color: "#fff", border: "none", cursor: "pointer", marginLeft: "5px" },
};
