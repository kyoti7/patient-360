import api from "./api";

// ─── GET ──────────────────────────────────────────────────── Fetch
export const getPatients = async () => {
  const response = await api.get("/patients");
  return response.data;
};

export const getPatientDetails = async (patientId) => {
  const response = await api.get(`/patient/${patientId}`);
  return response.data;
};

export const getPatientById = async (patientId) => {
  const response = await api.get(`/patient/${patientId}`);
  return response.data;
};

// ─── CREATE ────────────────────────────────────────────────── Add
export const createPatient = async (payload) => {
  const response = await api.post("/patient", payload);
  return response.data;
};

// ─── UPDATE ────────────────────────────────────────────────── Modify
export const updatePatient = async (patientId, payload) => {
  const response = await api.patch(`/patient/${patientId}`, payload);
  return response.data;
};

// ─── DELETE ────────────────────────────────────────────────── Remove
export const deletePatient = async (patientId) => {
  const response = await api.delete(`/patient/${patientId}`);
  return response.data;
};
