import { useState, useEffect } from "react";
import { EntidadConRecursos } from "../types/permisos.types";
import {
  obtenerEntidadesConRecursos,
  asignarPermisosARol,
} from "../../../api/permisosService";
import { toast } from "react-toastify";
import { RolDetalle } from "../types/roles.types";

type PermisoMarcado = { idEntidad: number; idRecurso: number };

export const usePermisos = (
  idRol: number | null,
  rolesDetalle: RolDetalle[],
  onSuccess?: () => void
) => {
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

        // Cargar permisos actuales del rol desde rolesDetalle
        const rolActual = rolesDetalle.find((rol) => rol.idRol === idRol);

        if (rolActual) {
          const permisosIniciales: PermisoMarcado[] = [];

          rolActual.entidades.forEach((entidadRol) => {
            const entidadSistema = data.find(
              (e) => e.idEntidad === entidadRol.idEntidad
            );

            if (!entidadSistema) return;

            entidadRol.acciones.forEach((accionNombre) => {
              const recursoEncontrado = entidadSistema.recursos.find(
                (r) =>
                  r.nombreRecurso.toLowerCase() === accionNombre.toLowerCase()
              );

              if (recursoEncontrado) {
                permisosIniciales.push({
                  idEntidad: entidadRol.idEntidad,
                  idRecurso: recursoEncontrado.idRecurso,
                });
              }
            });
          });

          setPermisosSeleccionados(permisosIniciales);
        }
      } catch (error) {
        toast.error("Error al obtener las entidades con recursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntidades();
  }, [idRol, rolesDetalle]);

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
      onSuccess?.();
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
