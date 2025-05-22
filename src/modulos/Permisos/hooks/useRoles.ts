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

  const fetchRoles = async () => {
    if (!filter.trim()) {
      setRolesDetalle([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getRolesDetalleByUsuarioNombre(filter);
      setRolesDetalle(data);
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
    loading,
    setFilter,
    fetchRoles,
  };
};
