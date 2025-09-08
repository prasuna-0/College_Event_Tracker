import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import dayjs from "dayjs";

export default function AdminDashboardWithCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://localhost:7123/api/Event");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Filter events by selected date (assuming event.startDate is in "YYYY-MM-DD" or similar)
  const filteredEvents = events.filter((event) =>
    dayjs(event.startDate).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD")
  );

  return (
    <div className="manage">

    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>Calendar View</h2>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />
      </div>

      <h3 style={{ textAlign: "center", marginTop: "30px" }}>
        Events on {dayjs(selectedDate).format("YYYY-MM-DD")}
      </h3>

      {filteredEvents.length === 0 ? (
        <p style={{ textAlign: "center" }}>No events on this date.</p>
      ) : (
        filteredEvents.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              margin: "10px auto",
              maxWidth: "600px",
              borderRadius: "8px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            }}
            >
            <h4 style={{ color: "#2563eb" }}>{event.title}</h4>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Status:</strong> {event.status}</p>
          </div>
        ))
      )}
    </div>
      </div>
  );
}

