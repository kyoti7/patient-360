import api from "./api";

export const getVisits = async () => {
  const response = await api.get("/visits");

  return response.data;
};

export const getVisitById = async (visitId) => {
  const response = await api.get(`/visit/${visitId}`);

  return response.data;
};

export const createVisit = async (payload) => {
  const response = await api.post("/visit", payload);

  return response.data;
};

export const updateVisit = async (visitId, payload) => {
  const response = await api.patch(`/visitt/${visitId}`, payload);

  return response.data;
};

export const deleteVisit = async (visitId) => {
  const response = await api.delete(`/visit/${visitId}`);

  return response.data;
};
