import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentEventFilter() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    faculty: "",
    year: "",
    eventStatus: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5226/api/Events");
        const eventList = response.data?.data || [];
        setEvents(eventList);
        setFilteredEvents(eventList);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
        setFilteredEvents([]);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];

    if (filters.faculty)
      filtered = filtered.filter(
        (e) =>
          e.faculty &&
          e.faculty.toLowerCase() === filters.faculty.toLowerCase()
      );

    if (filters.year)
      filtered = filtered.filter(
        (e) => new Date(e.startDate).getFullYear() === Number(filters.year)
      );

    if (filters.eventStatus)
      filtered = filtered.filter(
        (e) =>
          e.eventStatus &&
          e.eventStatus.toLowerCase() === filters.eventStatus.toLowerCase()
      );

    setFilteredEvents(filtered);
  }, [filters, events]);

  const years = Array.from(
    new Set(events.map((e) => new Date(e.startDate).getFullYear()))
  ).sort((a, b) => b - a); 

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{marginTop:"90px"}}>

    <div style={styles.container}>
      <h1 style={styles.heading}>Filter Events</h1>

      <div style={styles.filters}>
        <select
          name="faculty"
          value={filters.faculty}
          onChange={handleFilterChange}
          style={styles.select}
          >
          <option value="">All Faculties</option>
          <option value="BSCCSIT">BSCCSIT</option>
          <option value="BCA">BCA</option>
          <option value="BIM">BIM</option>
          <option value="BBS">BBS</option>
          <option value="BHM">BHM</option>
        </select>

        <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          style={styles.select}
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          name="eventStatus"
          value={filters.eventStatus}
          onChange={handleFilterChange}
          style={styles.select}
          >
          <option value="">All Statuses</option>
          <option value="Planned">Planned</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div style={styles.events}>
        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} style={styles.card}>
              <h2 style={styles.title}>{event.title}</h2>
              <p>{event.description || "No description"}</p>
              <p>
                <strong>Faculty:</strong> {event.faculty || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {event.eventStatus || "N/A"}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {event.startDate
                  ? new Date(event.startDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {event.endDate
                  ? new Date(event.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
</div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
    padding: "0 20px",
  },
  heading: { textAlign: "center", marginBottom: "20px" },
  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
    justifyContent: "center",
  },
  select: { padding: "8px", fontSize: "14px" },
  events: { display: "flex", flexDirection: "column", gap: "15px" },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  title: { fontSize: "18px", color: "#2563eb" },
};
