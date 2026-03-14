import instance from "./axiosInstance";
import {
  Curso,
  CursoPayload,
  ObtenerCursosRequest,
} from "../modulos/Cursos/types/cursos.types";
import { formatDateToDisplay } from "../utils/dateUtils";

const API_URL = "/Cursos";

/**
 * Mapea la respuesta del backend al modelo que utiliza el frontend.
 */
const mapCursoFromApi = (item: any): Curso => ({
  id_curso: item.idCurso,
  nombre: item.nombre,
  descripcion: item.descripcion,
  duracion: item.duracion,
  unidad_duracion: item.unidadDuracion,
  cantidad_cuota: item.cantidadCuota,
  monto_cuota: item.montoCuota,
  tiene_practica: item.tienePractica === "S",
  costo_practica: item.costoPractica,
  fecha_inicio: formatDateToDisplay(item.fechaInicio),
  fecha_fin: formatDateToDisplay(item.fechaFin),
  monto_matricula: item.montoMatricula,
  activo: item.activo === true || item.activo === "S" || item.activo === 1,
});

/**
 * Obtiene la lista de cursos aplicando filtros por fecha y estado.
 * Endpoint: POST /Cursos/obtener-cursos
 */
export const getCursos = async (
  params: ObtenerCursosRequest,
): Promise<Curso[]> => {
  try {
    const { data } = await instance.post(`${API_URL}/obtener-cursos`, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data.map(mapCursoFromApi);
  } catch (error: any) {
    console.error("❌ Error al obtener cursos:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

/**
 * Crea un nuevo curso.
 * Endpoint: POST /Cursos
 */
export const createCurso = async (curso: CursoPayload): Promise<number> => {
  try {
    const { data } = await instance.post(API_URL, curso);
    return data;
  } catch (error: any) {
    console.error("❌ Error al crear el curso:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

/**
 * Actualiza un curso existente.
 * Endpoint: PUT /Cursos/{id}
 */
export const updateCurso = async (
  id: number,
  curso: CursoPayload,
): Promise<void> => {
  try {
    await instance.put(`${API_URL}/${id}`, curso);
  } catch (error: any) {
    console.error("❌ Error al actualizar el curso:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

/**
 * Elimina un curso por ID.
 * Endpoint: DELETE /Cursos/{id}
 */
export const deleteCurso = async (id: number): Promise<void> => {
  try {
    await instance.delete(`${API_URL}/${id}`);
  } catch (error: any) {
    console.error("❌ Error al eliminar el curso:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

/**
 * Cambia el estado activo/inactivo de un curso.
 * Endpoint: PUT /Cursos/{id}/cambiar-estado
 */
export const cambiarEstadoCurso = async (
  id: number,
  activo: boolean,
): Promise<void> => {
  try {
    await instance.put(
      `${API_URL}/${id}/cambiar-estado`,
      { activo },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error("❌ Error al cambiar estado del curso:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};
