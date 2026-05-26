import api from "./api";

// ─── GET ──────────────────────────────────────────────────── Fetch
export const getAppointments = async (filters = {}) => {
  try {
    const params = {};

    if (filters.docid) params.docid = filters.docid;
    if (filters.status) params.status = filters.status;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;

    const response = await api.get("/appointments", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const getAppointment = async (apptId) => {
  try {
    const response = await api.get(`/appointment/${apptId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};

// ─── CREATE ────────────────────────────────────────────────── Add
export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post("/appointment", appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// ─── UPDATE ────────────────────────────────────────────────── Modify
export const updateAppointment = async (apptId, updatedData) => {
  try {
    const response = await api.patch(`/appointment/${apptId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// ─── DELETE ────────────────────────────────────────────────── Remove
export const deleteAppointment = async (apptId) => {
  try {
    const response = await api.delete(`/appointment/${apptId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};
