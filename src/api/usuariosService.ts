import axios from "axios";
import { Usuario } from "../modulos/Usuarios/types/usuarios.types";

const API_URL = `${import.meta.env.VITE_API_URL}/Usuarios`;

// ✅ Log para ver la URL que se está llamando
console.log("🔎 URL Base para Usuarios:", API_URL);

// Activar o desactivar usuario
export const activarUsuario = async (id: number): Promise<void> => {
  console.log(`🚀 Llamando a: ${API_URL}/activarusuario/${id}`);
  try {
    const response = await axios.put(`${API_URL}/activarusuario/${id}`);
    console.log("✅ Respuesta al activar usuario:", response.data);
  } catch (error: any) {
    console.error("❌ Error al activar/desactivar el usuario:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  console.log(`🚀 Llamando a: ${API_URL}`);
  try {
    const response = await axios.get(API_URL);
    console.log("✅ Respuesta al obtener usuarios:", response.data);
    return response.data.items;
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

// 🔄 Función para actualizar el usuario
export const actualizarUsuario = async (
  usuario: Partial<Usuario>
): Promise<void> => {
  console.log(`🚀 Actualizando usuario con ID: ${usuario.idUsuario}`);
  try {
    await axios.put(`${API_URL}/editar-usuario`, usuario);
    console.log("✅ Usuario actualizado correctamente");
  } catch (error: any) {
    console.error("❌ Error al actualizar el usuario:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};
