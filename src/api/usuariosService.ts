import axios from "axios";
import { Usuario } from "../modulos/Usuarios/types/usuarios.types";

const API_URL = `${import.meta.env.VITE_API_URL}/Usuarios`;

// ✅ Log para ver la URL que se está llamando
console.log("🔎 URL Base para Usuarios:", API_URL);

// ✅ Función para convertir "dd/MM/yyyy" → "yyyy-MM-dd"
const convertirFecha = (fecha: string): string => {
  if (!fecha.includes("/")) return fecha; // Si ya está formateado, lo dejamos
  const [day, month, year] = fecha.split("/");
  return `${year}-${month}-${day}`;
};

// ✅ Función para formatear "yyyy-MM-dd" → "dd/MM/yyyy"
const formatFecha = (fecha: string | null | undefined): string => {
  if (!fecha) return "Sin Fecha";

  try {
    const dateObj = new Date(fecha);

    if (isNaN(dateObj.getTime())) {
      console.warn(`⚠️ La fecha recibida no es válida: ${fecha}`);
      return "Fecha inválida";
    }

    // 🔄 Formato manual dd/MM/yyyy
    const dia = ("0" + dateObj.getDate()).slice(-2);
    const mes = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const anio = dateObj.getFullYear();

    return `${dia}/${mes}/${anio}`;
  } catch (error) {
    console.error("❌ Error al formatear la fecha:", error);
    return "Sin Fecha";
  }
};

// Activar o desactivar usuario
export const cambiarEstadoUsuario = async (id: number): Promise<void> => {
  console.log(`🚀 Llamando a: ${API_URL}/cambiar-estado/${id}`);
  try {
    await axios.put(
      `${API_URL}/cambiar-estado/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`✅ Estado del usuario ${id} actualizado correctamente.`);
  } catch (error: any) {
    console.error("❌ Error al cambiar estado del usuario:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (
  filtro: string = "",
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<Usuario[]> => {
  try {
    console.log(`🚀 Llamando a: ${API_URL}/obtener-usuarios`);

    // 🔄 Hacemos el request al endpoint correcto
    const response = await axios.get(`${API_URL}/obtener-usuarios`, {
      params: {
        filtro,
        pageNumber,
        pageSize,
      },
    });

    console.log("✅ Respuesta al obtener usuarios:", response.data);
    return response.data.usuarios; // 👈 Aquí es "usuarios", no "items"
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
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
