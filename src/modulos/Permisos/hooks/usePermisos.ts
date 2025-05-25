import { useState, useEffect } from "react";
import { EntidadConRecursos } from "../types/permisos.types";
import {
  obtenerEntidadesConRecursos,
  asignarPermisosARol,
} from "../../../api/permisosService";
import { toast } from "react-toastify";

type PermisoMarcado = { idEntidad: number; idRecurso: number };

export const usePermisos = (idRol: number | null) => {
  const [entidades, setEntidades] = useState<EntidadConRecursos[]>([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<
    PermisoMarcado[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (idRol === null) return;

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
  }, [idRol]);

  const togglePermiso = (idEntidad: number, idRecurso: number) => {
    const existe = permisosSeleccionados.some(
      (p) => p.idEntidad === idEntidad && p.idRecurso === idRecurso
    );

    if (existe) {
      setPermisosSeleccionados((prev) =>
        prev.filter(
          (p) => !(p.idEntidad === idEntidad && p.idRecurso === idRecurso)
        )
      );
    } else {
      setPermisosSeleccionados((prev) => [...prev, { idEntidad, idRecurso }]);
    }
  };

  const guardarPermisos = async () => {
    if (idRol === null) {
      toast.error("ID de rol no disponible.");
      return;
    }

    try {
      const permisos = permisosSeleccionados.map((p) => ({
        idEntidad: p.idEntidad,
        idRecurso: p.idRecurso,
      }));

      await asignarPermisosARol({ idRol, permisos });

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
