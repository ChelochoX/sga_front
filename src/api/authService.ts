// src/api/authService.ts
import instance from "./axiosInstance";
import { LoginRequest, ChangePasswordRequest } from "../types/auth";

// ✅ Login de usuario
export const login = async (credentials: LoginRequest) => {
  try {
    console.log("🔄 Enviando credenciales al login...");
    const response = await instance.post("/api/Auth/login", credentials); // 👈 Ruta absoluta con Axios
    const data = response.data;

    if (data.parTokens?.bearerToken) {
      localStorage.setItem("token", data.parTokens.bearerToken);
      console.log("✅ Token almacenado en localStorage");
    }

    console.log("✅ Respuesta de Login:", data);
    return data;
  } catch (error) {
    console.error("❌ Error en login:", error);
    throw error;
  }
};

// ✅ Cambio de contraseña
export const changePassword = async (data: ChangePasswordRequest) => {
  try {
    console.log("🔄 Enviando datos para cambiar contraseña...");
    const response = await instance.post("/api/Auth/cambiar-contrasena", data);
    console.log("✅ Respuesta de cambio de contraseña:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error en cambio de contraseña:", error);
    throw error;
  }
};

///DATOS DEL USUARIO PARA PRUEBAS
//usuario: cesar.lezca46c4
//contrasena: 123456
