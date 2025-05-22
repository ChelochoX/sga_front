import axios from "axios";
import { RolDetalle, RolCatalogo } from "../modulos/Permisos/types/roles.types";

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
