import axios from "axios";

// ─── CLIENT ────────────────────────────────────────────────── Setup
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ─── INTERCEPTOR ───────────────────────────────────────────── Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      detail: "Server unreachable",
    });
  },
);

export default api;
