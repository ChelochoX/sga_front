import { useEffect, useState } from "react";
import {
  getEntidades,
  getRecursos,
  getPermisosByRol,
} from "../../../api/permisosService";
import { Entidad, Recurso, Permiso } from "../types/permisos.types";

export const usePermisos = (idRol: number) => {
  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [entidadesData, recursosData, permisosData] = await Promise.all([
          getEntidades(),
          getRecursos(),
          getPermisosByRol(idRol),
        ]);
        setEntidades(entidadesData);
        setRecursos(recursosData);
        setPermisos(permisosData);
      } catch (err: any) {
        setError("Error al cargar datos");
        console.error("❌ Error al cargar datos:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (idRol) {
      fetchData();
    }
  }, [idRol]);

  return {
    entidades,
    recursos,
    permisos,
    loading,
    error,
  };
};
