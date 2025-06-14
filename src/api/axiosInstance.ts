// src/api/axiosInstance.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL; // Ej: "/api" o "https://localhost:7200/api"

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de petición: inyecta el Bearer token si existe en localStorage
instance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token && request.headers) {
      // En lugar de asignar un objeto nuevo con spread, simplemente mutamos la propiedad Authorization
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    // Si hubo algún problema antes de enviar la petición
    return Promise.reject(error);
  }
);

// Interceptor de respuesta: loguea respuestas o errores globales
instance.interceptors.response.use(
  (response) => {
    return response; // devolvemos la respuesta para que continúe la llamada .then/.catch
  },
  (error) => {
    console.error("❌ Error en Axios:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default instance;
