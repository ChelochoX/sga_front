import instance from "./axiosInstance";
import { Usuario } from "../modulos/Usuarios/types/usuarios.types";

const API_URL = `/Usuarios`;

//
// ==========================================================
// PUT /Usuarios/cambiar-estado/{id}
// Activa o desactiva un usuario según su estado actual
// ==========================================================
//
export const cambiarEstadoUsuario = async (id: number): Promise<void> => {
  try {
    await instance.put(
      `${API_URL}/cambiar-estado/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error("❌ Error al cambiar estado del usuario:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

//
// ==========================================================
// GET /Usuarios/obtener-usuarios
// Obtiene la lista de usuarios con filtro y paginación
// ==========================================================
//
export const getUsuarios = async (
  filtro: string = "",
  pageNumber: number = 1,
  pageSize: number = 10,
): Promise<Usuario[]> => {
  try {
    const response = await instance.get(`${API_URL}/obtener-usuarios`, {
      params: {
        filtro,
        pageNumber,
        pageSize,
      },
    });

    return response.data.usuarios;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    throw error;
  }
};

//
// ==========================================================
// PUT /Usuarios/editar-usuario
// Actualiza los datos de un usuario existente
// ==========================================================
//
export const actualizarUsuario = async (
  usuario: Partial<Usuario>,
): Promise<void> => {
  try {
    await instance.put(`${API_URL}/editar-usuario`, usuario);
  } catch (error: any) {
    console.error("❌ Error al actualizar el usuario:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};
