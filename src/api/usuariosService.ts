import axios from "axios";
import { Usuario } from "../modulos/Usuarios/types/usuarios.types";

const API_URL = `${import.meta.env.VITE_API_URL}/Usuarios`;

// Activar o desactivar usuario
export const activarUsuario = async (id: number): Promise<void> => {
  try {
    await axios.put(`${API_URL}/activarusuario/${id}`);
  } catch (error) {
    console.error("❌ Error al activar/desactivar el usuario:", error);
    throw error;
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data.items;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    throw error;
  }
};
