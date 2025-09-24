import axios from "axios";

const API_BASE = "http://localhost:5226/api";

const token = localStorage.getItem("token"); // JWT token if using auth

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export const getEvents = () => api.get("/events");
export const registerEvent = (eventId) => api.post(`/events/${eventId}/register`);
export const cancelRegistration = (eventId) => api.delete(`/events/${eventId}/cancel-registration`);
export const getMyRegistrations = () => api.get("/events/my-registrations");
