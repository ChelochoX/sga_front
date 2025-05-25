// src/modulos/Permisos/hooks/usePermisos.ts

import { useState, useEffect } from "react";
import { EntidadConRecursos } from "../types/permisos.types";
import {
  obtenerEntidadesConRecursos,
  asignarPermisosARol,
} from "../../../api/permisosService";
import { toast } from "react-toastify";

export const usePermisos = (idRol: number) => {
  const [entidades, setEntidades] = useState<EntidadConRecursos[]>([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<number[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEntidades = async () => {
      setLoading(true);
      try {
        const data = await obtenerEntidadesConRecursos();
        setEntidades(data);
        // Aquí podrías cargar los permisos actuales del rol si es necesario
      } catch (error) {
        toast.error("Error al obtener las entidades con recursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntidades();
  }, []);

  const togglePermiso = (idRecurso: number) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(idRecurso)
        ? prev.filter((id) => id !== idRecurso)
        : [...prev, idRecurso]
    );
  };

  const guardarPermisos = async () => {
    try {
      await asignarPermisosARol({ idRol, permisos: permisosSeleccionados });
      toast.success("Permisos asignados correctamente.");
    } catch (error) {
      toast.error("Error al asignar los permisos.");
    }
  };

  return {
    entidades,
    permisosSeleccionados,
    togglePermiso,
    guardarPermisos,
    loading,
  };
};
