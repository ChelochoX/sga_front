// src/api/axiosInstance.ts
import axios from "axios";

// Creamos una instancia personalizada
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para agregar token automáticamente
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
