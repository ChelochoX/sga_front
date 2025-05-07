import axios from "axios";

// ✅ Usando la variable de entorno correctamente
const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("🔎 Base URL configurada:", API_BASE_URL);

const instance = axios.create({
  baseURL: API_BASE_URL, // ← Aquí se configura la URL base
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptores para manejar errores y logs
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Error en Axios:", error.response);
    return Promise.reject(error);
  }
);

export default instance;
