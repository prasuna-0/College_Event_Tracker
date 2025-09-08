import { useState } from "react";
import axios from "axios";

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    await axios.post("http://localhost:5226/api/Events", payload);
    alert("Event created successfully!");
  } catch (err) {
    const backendMessage = err.response?.data?.message || "Unknown error";
    const backendErrors = err.response?.data?.errors || [];

    console.error("Error creating event:", backendMessage, backendErrors);

    alert(`Failed to create event: ${backendMessage}\n${backendErrors.join("\n")}`);
  }
};

  const formStyle = {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold"
  };

  const buttonStyle = {
    backgroundColor: "#0d0d0dff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Create Event</h2>

      <label style={labelStyle}>Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />

      <label style={labelStyle}>Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} style={inputStyle} rows="3" />

      <label style={labelStyle}>Start Date</label>
      <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required style={inputStyle} />

      <label style={labelStyle}>End Date</label>
      <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required style={inputStyle} />

  <label style={labelStyle}>Status</label>
<select
  name="eventStatus"
  value={formData.eventStatus}
  onChange={handleChange}
  required
  style={inputStyle}
>
  <option value="">Select Status</option>
  <option value="Upcoming">Upcoming</option>
  <option value="Active">Active</option>
  <option value="Cancelled">Cancelled</option>
  <option value="Completed">Completed</option>
  <option value="Planned">Planned</option>
</select>

      <label style={labelStyle}>Location</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} required style={inputStyle} />

      <label style={labelStyle}>Faculty</label>
      <select name="faculty" value={formData.faculty} onChange={handleChange} required style={inputStyle}>
        <option value=""> Select Faculty </option>
        <option value="BScCSIT">BScCSIT</option>
        <option value="ALL">ALL</option>
        <option value="BIM">BIM</option>
        <option value="BCA">BCA</option>
        <option value="BBS">BBS</option>
        <option value="HM">HM</option>
      </select>

      <label style={labelStyle}>Scope</label>
      <select name="eventScope" value={formData.eventScope} onChange={handleChange} required style={inputStyle}>
        <option value=""> Select Scope </option>
        <option value="Intercollege">Intercollege</option>
        <option value="CollegeLevel">CollegeLevel</option>
        <option value="FacultyLevel">FacultyLevel</option>
      </select>

      <label style={labelStyle}>Type of Event</label>
      <input type="text" name="eventType" value={formData.eventType} onChange={handleChange} required style={inputStyle} />

      <label style={labelStyle}>Objective</label>
      <textarea name="objective" value={formData.objective} onChange={handleChange} style={inputStyle} rows="4" required />

      <button type="submit" style={buttonStyle}>Submit</button>
    </form>
  );
}

