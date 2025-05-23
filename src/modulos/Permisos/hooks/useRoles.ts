import { useState, useEffect } from "react";
import { RolDetalle, RolCatalogo } from "../types/roles.types";
import {
  getRolesDetalleByUsuarioNombre,
  getRolesCatalogo,
} from "../../../api/permisosService";

export const useRoles = () => {
  const [rolesDetalle, setRolesDetalle] = useState<RolDetalle[]>([]);
  const [rolesCatalogo, setRolesCatalogo] = useState<RolCatalogo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const fetchRoles = async () => {
    if (!filter.trim()) {
      setRolesDetalle([]);
      setSelectedRoles([]); // 🔄 reset al cambiar búsqueda
      return;
    }

    setLoading(true);
    try {
      const data = await getRolesDetalleByUsuarioNombre(filter);
      setRolesDetalle(data);

      // ✅ Aquí extraemos los roles que ya tiene asignado
      const idsAsignados = data.map((rol) => rol.idRol);
      setSelectedRoles(idsAsignados);
    } catch (err) {
      console.error("❌ Error al obtener roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogoRoles = async () => {
    try {
      const data = await getRolesCatalogo();
      setRolesCatalogo(data);
    } catch (err) {
      console.error("❌ Error al obtener el catálogo de roles:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [filter]);

  useEffect(() => {
    fetchCatalogoRoles();
  }, []);

  return {
    rolesDetalle,
    rolesCatalogo,
    selectedRoles,
    setSelectedRoles,
    loading,
    setFilter,
    fetchRoles,
  };
};
