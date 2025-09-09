

import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";

export default function CCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const fetchEventsByDate = async (date) => {
    setLoading(true);
    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const response = await axios.get(
        `http://localhost:5226/api/Events/by-date?date=${formattedDate}`
      );
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsByDate(selectedDate);
  }, [selectedDate]);

  return (
    <div style={{marginTop:"90px",height:"100px" ,backgroundColor:"white"}}>

    <div style={{ padding: "40px", fontFamily: "Arial",height:"100px" }}>
      <h2 style={{ textAlign: "center" }}>Calendar View</h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>

      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        Events on {dayjs(selectedDate).format("YYYY-MM-DD")}
      </h3>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading events...</p>
      ) : events.length === 0 ? (
        <p style={{ textAlign: "center" }}>No events on this date.</p>
      ) : (
        events.map((event) => (
          <div
          key={event.id}
          style={{
            border: "1px solid #ddd",
            backgroundColor:"white",
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
            <p><strong>Status:</strong> {event.eventStatus}</p>
            <p><strong>Start:</strong> {dayjs(event.startDate).format("YYYY-MM-DD")}</p>
            <p><strong>End:</strong> {dayjs(event.endDate).format("YYYY-MM-DD")}</p>
          </div>
        ))
      )}
      </div>
    </div>
  );
}
