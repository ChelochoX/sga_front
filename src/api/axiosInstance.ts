// src/api/axiosInstance.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((request) => {
  console.log("📤 Axios Request:", request);
  return request;
});

instance.interceptors.response.use(
  (response) => {
    console.log("📥 Axios Response:", response);
    return response;
  },
  (error) => {
    console.error("❌ Error en Axios:", error.response);
    return Promise.reject(error);
  }
);

export default instance;
