// src/api/authService.ts
import instance from "./axiosInstance";
import { LoginRequest, ChangePasswordRequest } from "../types/auth";

let usuario: string | null = null;
let permisos: string[] = [];

export const login = async (credentials: LoginRequest) => {
  try {
    const response = await instance.post("/Auth/login", credentials);

    const bearerToken = response.data.parTokens?.bearerToken;
    const nombreUsuario = response.data?.parUsuario?.nombreUsuario;

    if (bearerToken) {
      localStorage.setItem("token", bearerToken);
    }

    if (nombreUsuario) {
      usuario = nombreUsuario;
      localStorage.setItem("usuario", nombreUsuario);
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

export const obtenerPermisosPorUsuario = async (nombreUsuario: string) => {
  const response = await instance.get("/Roles/usuarios/detalle-roles", {
    params: { nombreUsuario },
  });
  return response.data;
};

export const logout = () => {
  localStorage.clear();
  usuario = null;
  permisos = [];
};

export const getUsuario = (): string | null => {
  return usuario ?? localStorage.getItem("usuario");
};

export const getPermisos = (): string[] => {
  if (permisos.length > 0) return permisos;
  const perms = localStorage.getItem("permisos");
  return perms ? JSON.parse(perms) : [];
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const puedeVerModulo = (modulo: string): boolean => {
  const permisos = getPermisos();

  // Si tus permisos son entidades con nombreEntidad:
  const modulos = permisos.flatMap((rol: any) =>
    rol.entidades?.map((e: any) => e.nombreEntidad?.toLowerCase())
  );

  return modulos.includes(modulo.toLowerCase());
};
