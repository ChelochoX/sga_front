// src/api/axiosInstance.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de petición: inyecta el Bearer token si existe en localStorage
instance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token && request.headers) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

export default instance;
