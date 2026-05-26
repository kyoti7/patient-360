import api from "./api";

export const getBillings = async () => {
  const response = await api.get("/billings");

  return response.data;
};

export const getBillingDetails = async (billingId) => {
  const response = await api.get(`/billing/${billingId}`);

  return response.data;
};

export const createBilling = async (payload) => {
  const response = await api.post("/billing", payload);

  return response.data;
};

export const updateBilling = async (billingId, payload) => {
  const response = await api.patch(`/billing/${billingId}`, payload);

  return response.data;
};

export const deleteBilling = async (billingId) => {
  const response = await api.delete(`/billing/${billingId}`);

  return response.data;
};
