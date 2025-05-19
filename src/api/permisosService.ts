// permisosService.ts
import axios from "axios";
import {
  Recurso,
  Entidad,
  Permiso,
} from "../modulos/Permisos/types/permisos.types";

// ✅ Usando variable de entorno del .env.development
const API_URL = `${import.meta.env.VITE_API_URL}`;

// -------------------------------------------
// ✅ Obtener todos los Recursos
// Endpoint: GET /Permisos/recursos
// -------------------------------------------
export const getRecursos = async (): Promise<Recurso[]> => {
  try {
    const response = await axios.get(`${API_URL}/Permisos/recursos`);
    console.log("✅ Recursos obtenidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener recursos:", error);
    throw error;
  }
};

// -------------------------------------------
// ✅ Obtener todas las Entidades
// Endpoint: GET /Permisos/entidades
// -------------------------------------------
export const getEntidades = async (): Promise<Entidad[]> => {
  try {
    const response = await axios.get(`${API_URL}/Permisos/entidades`);
    console.log("✅ Entidades obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener entidades:", error);
    throw error;
  }
};

// -------------------------------------------
// ✅ Obtener Permisos por Rol
// Endpoint: GET /Permisos/{idRol}/permisos
// -------------------------------------------
export const getPermisosByRol = async (idRol: number): Promise<Permiso[]> => {
  try {
    const response = await axios.get(`${API_URL}/Permisos/${idRol}/permisos`);
    console.log(
      `✅ Permisos obtenidos para el Rol ID ${idRol}:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error al obtener permisos para el Rol ID ${idRol}:`,
      error
    );
    throw error;
  }
};

// ✅ Obtener Usuarios con Filtro
export const getUsuarios = async (
  filtro: string,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    const response = await axios.get(`${API_URL}/Usuarios/obtener-usuarios`, {
      params: { filtro, pageNumber: page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    throw error;
  }
};

// ✅ Obtener Roles
export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/Roles/obtener-todos`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener roles:", error);
    throw error;
  }
};
