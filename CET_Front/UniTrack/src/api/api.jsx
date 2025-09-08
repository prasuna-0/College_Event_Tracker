import axios from "axios";

export const API_BASE = "http://localhost:5226/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Allocate Budget API
export const allocateBudget = (payload) => {
  return api.post("/budget/allocate", payload);
};


