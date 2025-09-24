


import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

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

        const today = dayjs();

        const updatedEvents = eventList.map((event) => {
          const start = dayjs(event.startDate);
          const end = dayjs(event.endDate);

          let newStatus = event.eventStatus;

          if (end.isBefore(today, "day")) {
            newStatus = "Completed";
          } else if (
            (event.eventStatus === "Planned" || event.eventStatus === "Upcoming") &&
            start.isBefore(today.add(1, "day"), "day")
          ) {
            newStatus = "Active";
          } else if (start.isAfter(today, "day")) {
            newStatus = "Upcoming";
          }
          return { ...event, eventStatus: newStatus };
        });

        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents);
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
    <div style={styles.bg}>
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
            <option value="BSCCSIT">BSc.CSIT</option>
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
            <option value="">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div style={styles.eventsGrid}>
          {filteredEvents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} style={styles.card} className="event-card">
                <h2 style={styles.title}>{event.title}</h2>
                <p>{event.description || "No description"}</p>
                <p>
                  <strong>Faculty:</strong> {event.faculty || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        event.eventStatus === "Completed"
                          ? "red"
                          : event.eventStatus === "Active"
                          ? "green"
                          : event.eventStatus === "Upcoming"
                          ? "orange"
                          : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {event.eventStatus || "N/A"}
                  </span>
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
  bg: {
    backgroundColor: "#f5f6f7", 
    minHeight: "100vh",
    padding: "50px 0",
    marginTop:"70px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    padding: "0 20px",
  },
  heading: { textAlign: "center", marginBottom: "20px" },
  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  select: { padding: "8px", fontSize: "14px", borderRadius: 6 },
  eventsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "15px",
  },
  card: {
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },
  title: { fontSize: "18px", color: "#2563eb", marginBottom: 8 },
};

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".event-card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
    });
  });
});
