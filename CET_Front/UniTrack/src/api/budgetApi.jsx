import axios from "axios";

const API_BASE = "http://localhost:5226/api/budget/allocate"; 

export const allocateBudget = (data, token) =>
  axios.post(`${API_BASE}/allocate`, data, { headers: { Authorization: `Bearer ${token}` } });

export const updateBudget = (eventId, data, token) =>
  axios.put(`${API_BASE}/${eventId}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteBudget = (budgetId, token) =>
  axios.delete(`${API_BASE}/${budgetId}`, { headers: { Authorization: `Bearer ${token}` } });

export const getBudgetByEvent = (eventId, token) =>
  axios.get(`${API_BASE}/${eventId}`, { headers: { Authorization: `Bearer ${token}` } });

export const getBudgetSummary = (eventId, token) =>
  axios.get(`${API_BASE}/${eventId}/summary`, { headers: { Authorization: `Bearer ${token}` } });

export const getExpenses = (eventId, token) =>
  axios.get(`${API_BASE}/${eventId}/expenses`, { headers: { Authorization: `Bearer ${token}` } });

export const addExpense = (eventId, formData, token) =>
  axios.post(`${API_BASE}/${eventId}/expenses`, formData, {
    headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
  });

export const updateExpense = (eventId, expenseId, formData, token) =>
  axios.put(`${API_BASE}/${eventId}/expenses/${expenseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
  });

export const deleteExpense = (eventId, expenseId, token) =>
  axios.delete(`${API_BASE}/${eventId}/expenses/${expenseId}`, { headers: { Authorization: `Bearer ${token}` } });

export const getBudgetHeads = (budgetId, token) =>
  axios.get(`${API_BASE}/${budgetId}/heads`, { headers: { Authorization: `Bearer ${token}` } });

export const addBudgetHead = (budgetId, data, token) =>
  axios.post(`${API_BASE}/${budgetId}/heads`, data, { headers: { Authorization: `Bearer ${token}` } });

export const updateBudgetHead = (headId, data, token) =>
  axios.put(`${API_BASE}/heads/${headId}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const deleteBudgetHead = (headId, token) =>
  axios.delete(`${API_BASE}/heads/${headId}`, { headers: { Authorization: `Bearer ${token}` } });
