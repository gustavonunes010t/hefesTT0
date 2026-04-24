import axios from "axios";

// URL base da API (do .env)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Cria instância do axios configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// ============================================
// INTERCEPTOR DE REQUISIÇÃO
// Adiciona token automaticamente em todas as requisições
// ============================================
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

// ============================================
// INTERCEPTOR DE RESPOSTA
// Trata erros globalmente (ex: token expirado)
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se token expirou (401), remove e redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;