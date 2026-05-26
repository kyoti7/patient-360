import api from "./api";

export const getClinicalNotes = async (patientId) => {
  try {
    const response = await api.get(`/clinical-notes/${patientId}`);
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch clinical notes:", error);
    return { clinical_notes: [] };
  }
};

export const getDiagnosticRecords = async (patientId) => {
  try {
    const response = await api.get(`/diagnostic-records/${patientId}`);
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch diagnostic records:", error);
    return { diagnostic_records: [] };
  }
};

export const getTreatmentPlans = async (patientId) => {
  try {
    const response = await api.get(`/treatment-plans/${patientId}`);
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch treatment plans:", error);
    return { treatment_plans: [] };
  }
};

export const createClinicalNote = async (payload) => {
  const response = await api.post("/clinical-notes", payload);
  return response.data;
};

export const createDiagnosticRecord = async (payload) => {
  const response = await api.post("/diagnostic-records", payload);
  return response.data;
};

export const createTreatmentPlan = async (payload) => {
  const response = await api.post("/treatment-plans", payload);
  return response.data;
};

export const updateClinicalNote = async (patientId, visitId, payload) => {
  const response = await api.patch(
    `/clinical-notes/${patientId}/${visitId}`,
    payload,
  );

  return response.data;
};

export const updateDiagnosticRecord = async (patientId, visitId, payload) => {
  const response = await api.patch(
    `/diagnostic-records/${patientId}/${visitId}`,
    payload,
  );

  return response.data;
};

export const updateTreatmentPlan = async (patientId, visitId, payload) => {
  const response = await api.patch(
    `/treatment-plans/${patientId}/${visitId}`,
    payload,
  );

  return response.data;
};

export const deleteClinicalNote = async (patientId, visitId) => {
  const response = await api.delete(
    `/clinical-notes/${patientId}/${visitId}`,
  );

  return response.data;
};

export const deleteDiagnosticRecord = async (patientId, visitId) => {
  const response = await api.delete(
    `/diagnostic-records/${patientId}/${visitId}`,
  );

  return response.data;
};

export const deleteTreatmentPlan = async (patientId, visitId) => {
  const response = await api.delete(
    `/treatment-plans/${patientId}/${visitId}`,
  );

  return response.data;
};
