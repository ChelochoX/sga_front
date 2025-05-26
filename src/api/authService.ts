// src/api/authService.ts
import instance from "./axiosInstance";
import { LoginRequest, ChangePasswordRequest } from "../types/auth";

// ✅ Login de usuario
export const login = async (credentials: LoginRequest) => {
  try {
    const response = await instance.post("/Auth/login", credentials);

    // Guardamos token si viene
    if (response.data.parTokens?.bearerToken) {
      localStorage.setItem("token", response.data.parTokens.bearerToken);
      console.log("✅ Token almacenado en localStorage");
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;
      const message = data?.message || "Error en el login";

      // Lanza un error simulando el objeto Axios error
      const err = new Error(message) as any;
      err.response = error.response; // <- Añadimos la response para que el catch del componente la pueda leer
      throw err;
    } else if (error.request) {
      const err = new Error(
        "💔 El servidor no está respondiendo. Intenta más tarde."
      ) as any;
      throw err;
    } else {
      throw new Error(error.message || "Ocurrió un error inesperado.");
    }
  }
};

// ✅ Cambio de contraseña
export const changePassword = async (data: ChangePasswordRequest) => {
  try {
    console.log("🔄 Enviando datos para cambiar contraseña...");
    const response = await instance.post("/Auth/cambiar-contrasena", data);

    return response.data;
  } catch (error) {
    console.error("❌ Error en cambio de contraseña:", error);
    throw error;
  }
};
