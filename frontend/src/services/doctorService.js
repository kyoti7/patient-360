import api from "./api";

export const getDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post("/doctor", doctorData);
  return response.data;
};

export const updateDoctor = async (doctorId, doctorData) => {
  const response = await api.patch(`/doctor/${doctorId}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (doctorId) => {
  const response = await api.delete(`/doctor/${doctorId}`);
  return response.data;
};

export const getDoctorById = async (doctorId) => {
  const response = await api.get(`/doctor/${doctorId}`);
  return response.data;
};
