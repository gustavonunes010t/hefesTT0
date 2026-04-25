import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_URL = BASE_URL + "/api";

export const API_ORIGIN = (() => {
  try {
    return new URL(BASE_URL).origin;
  } catch {
    return "http://localhost:5000";
  }
})();

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;