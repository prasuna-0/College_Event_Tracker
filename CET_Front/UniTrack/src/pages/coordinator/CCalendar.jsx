


import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";

export default function AdminDashboardWithCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [datesWithEvents, setDatesWithEvents] = useState({});
  const [popupEvent, setPopupEvent] = useState(null);

  const fetchAllEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5226/api/Events");
      const allEvents = response.data.data || [];

      const dates = {};

      allEvents.forEach((ev) => {
        const start = dayjs(ev.startDate);
        const end = dayjs(ev.endDate);
        let current = start;

        while (current.isBefore(end.add(1, "day"))) {
          const formatted = current.format("YYYY-MM-DD");
          if (!dates[formatted]) dates[formatted] = [];
          dates[formatted].push(ev.eventStatus);
          current = current.add(1, "day");
        }
      });

      setDatesWithEvents(dates);
    } catch (error) {
      console.error("Failed to fetch events for calendar:", error);
    }
  };

  const fetchEventsByDate = async (date) => {
    setLoading(true);
    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const response = await axios.get(
        `http://localhost:5226/api/Events/by-date?date=${formattedDate}`
      );

      const fetchedEvents = response.data.data || [];
      const today = dayjs();

      const updatedEvents = fetchedEvents.map((event) => {
        const start = dayjs(event.startDate);
        const end = dayjs(event.endDate);

        let newStatus;
        if (event.eventStatus === "Cancelled") newStatus = "Cancelled";
        else if (end.isBefore(today, "day")) newStatus = "Completed";
        else if (start.isAfter(today, "day")) newStatus = "Upcoming";
        else newStatus = "Active";

        return { ...event, eventStatus: newStatus };
      });

      setEvents(updatedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    fetchEventsByDate(selectedDate);
  }, [selectedDate]);

  return (
    <div style={{ backgroundColor: "#f5f6f7", minHeight: "100vh", paddingTop: "90px" }}>
      <div style={{ display: "flex", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ flex: "1", maxWidth: "400px", marginRight: "40px" }}>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const formatted = dayjs(date).format("YYYY-MM-DD");
                if (datesWithEvents[formatted]) {
                  return <div style={{ textAlign: "center", marginTop: "2px" }}>★</div>;
                }
              }
              return null;
            }}
          />
        </div>

        <div style={{ flex: "2" }}>
          <h3 style={{ textAlign: "center" }}>
            Events on {dayjs(selectedDate).format("YYYY-MM-DD")}
          </h3>

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading events...</p>
          ) : events.length === 0 ? (
            <p style={{ textAlign: "center" }}>No events on this date.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ background: "#e0e0e0" }}>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Title</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>View</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{event.title}</td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color:
                          event.eventStatus === "Completed"
                            ? "red"
                            : event.eventStatus === "Active" || event.eventStatus === "Upcoming"
                            ? "blue"
                            : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {event.eventStatus}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                      <button
                        style={{
                          padding: "5px 10px",
                          cursor: "pointer",
                          backgroundColor: "#ADD8E6",
                          border: "none",
                          borderRadius: "4px",
                        }}
                        onClick={() => setPopupEvent(event)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Popup Modal */}
          {popupEvent && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
              onClick={() => setPopupEvent(null)}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  width: "500px",
                  maxHeight: "80%",
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>{popupEvent.title}</h2>
                <p><strong>Description:</strong> {popupEvent.description}</p>
                <p><strong>Location:</strong> {popupEvent.location}</p>
                <p><strong>Status:</strong> {popupEvent.eventStatus}</p>
                <p><strong>Start:</strong> {dayjs(popupEvent.startDate).format("YYYY-MM-DD")}</p>
                <p><strong>End:</strong> {dayjs(popupEvent.endDate).format("YYYY-MM-DD")}</p>
                <button
                  style={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => setPopupEvent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
