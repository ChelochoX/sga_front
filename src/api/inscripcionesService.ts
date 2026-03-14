import instance from "./axiosInstance";
import {
  Estudiante,
  Curso,
  InscripcionRequest,
  InscripcionDetalle,
} from "../modulos/Inscripciones/types/inscripciones.types";

const API_URL = "/Inscripciones";

const normalizeQuery = (value?: string) => value?.trim() || undefined;

/**
 * Obtiene la lista de personas habilitadas para inscripción.
 * El endpoint debe retornar únicamente personas con rol Estudiante.
 * Endpoint: GET /Inscripciones/estudiantes
 */
export const getEstudiantes = async (q = ""): Promise<Estudiante[]> => {
  const { data } = await instance.get<Estudiante[]>(`${API_URL}/estudiantes`, {
    params: { q: normalizeQuery(q) },
  });
  return data;
};

/**
 * Obtiene la lista de cursos activos disponibles para inscripción.
 * Endpoint: GET /Inscripciones/obtener-cursos
 */
export const getCursos = async (q = ""): Promise<Curso[]> => {
  const { data } = await instance.get<Curso[]>(`${API_URL}/obtener-cursos`, {
    params: { search: normalizeQuery(q) },
  });
  return data;
};

/**
 * Crea una nueva inscripción.
 * Endpoint: POST /Inscripciones
 */
export const createInscripcion = async (
  payload: InscripcionRequest,
): Promise<number> => {
  const { data } = await instance.post<number>(API_URL, payload);
  return data;
};

/**
 * Obtiene el listado de inscripciones con filtros opcionales.
 * Endpoint: GET /Inscripciones
 */
export const getInscripciones = async (
  alumno?: string,
  cursoNombre?: string,
  fechaDesde?: string,
  fechaHasta?: string,
): Promise<InscripcionDetalle[]> => {
  const { data } = await instance.get<InscripcionDetalle[]>(API_URL, {
    params: {
      alumno: normalizeQuery(alumno),
      cursoNombre: normalizeQuery(cursoNombre),
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    },
  });

  return data;
};

/**
 * Elimina una inscripción por su identificador.
 * Endpoint: DELETE /Inscripciones/{id}
 */
export const deleteInscripcion = async (id: number): Promise<void> => {
  await instance.delete(`${API_URL}/${id}`);
};
