// src/api/authService.ts
import instance from "./axiosInstance";
import { LoginRequest, ChangePasswordRequest } from "../types/auth";

// ✅ Login de usuario
export const login = async (credentials: LoginRequest) => {
  try {
    const response = await instance.post("/Auth/login", credentials);

    // Guardamos token si viene
    const bearerToken = response.data.parTokens?.bearerToken;
    if (bearerToken) {
      localStorage.setItem("token", bearerToken);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const data = error.response.data;
      const message = data?.message || "Error en el login";

      const err = new Error(message) as any;
      err.response = error.response;
      throw err;
    } else if (error.request) {
      throw new Error("El servidor no está respondiendo. Intenta más tarde.");
    } else {
      throw new Error(error.message || "Ocurrió un error inesperado.");
    }
  }
};
// ✅ Cambio de contraseña
export const changePassword = async (data: ChangePasswordRequest) => {
  try {
    const response = await instance.post("/Auth/cambiar-contrasena", data);

    return response.data;
  } catch (error) {
    console.error("❌ Error en cambio de contraseña:", error);
    throw error;
  }
};
