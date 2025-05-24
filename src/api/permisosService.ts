import axios from "axios";
import {
  RolDetalle,
  RolCatalogo,
  ActualizarRolesRequest,
} from "../modulos/Permisos/types/roles.types";

// ✅ Base API desde .env
const API_URL = `${import.meta.env.VITE_API_URL}/Roles`;

// 🟢 Obtener roles con permisos por nombre de usuario
export const getRolesDetalleByUsuarioNombre = async (
  filtro: string
): Promise<RolDetalle[]> => {
  const response = await axios.get(`${API_URL}/usuarios/detalle-roles`, {
    params: { nombreUsuario: filtro },
  });
  return response.data;
};

// ✅ catálogo de roles
export const getRolesCatalogo = async (): Promise<RolCatalogo[]> => {
  try {
    const { data } = await axios.get(`${API_URL}/obtener-todos`);

    // Validar que data sea array
    if (!Array.isArray(data)) {
      console.error("❌ La respuesta no es un array:", data);
      return [];
    }

    return data; // [{ idRol: 1, nombreRol: "Admin" }, ...]
  } catch (error) {
    console.error("❌ Error al obtener roles del catálogo:", error);
    return [];
  }
};

export const actualizarRolesUsuario = async (
  nombreUsuario: string,
  idsRoles: number[]
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/actualizar-roles`, {
      nombreUsuario,
      idsRoles,
    });
    console.log("✅ Roles actualizados correctamente desde el servicio.");
  } catch (error) {
    console.error("❌ Error al actualizar roles en el servicio:", error);
    throw error;
  }
};
