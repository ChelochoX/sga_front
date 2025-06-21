import { useState } from "react";
import { obtenerPermisosPorUsuario } from "../../../api/authService";
import { PermisoRol } from "../types/permisos.types";

export function usePermisosLogin() {
  const [permisos, setPermisos] = useState<PermisoRol[]>([]);

  const cargarPermisos = async (nombreUsuario: string) => {
    const data = await obtenerPermisosPorUsuario(nombreUsuario);
    setPermisos(data);
    return data; // ✅ Esto es necesario
  };

  return {
    permisos,
    setPermisos,
    cargarPermisos,
  };
}
