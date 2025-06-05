// src/api/inscripcionesService.ts
import instance from "./axiosInstance";
import {
  Estudiante,
  Curso,
  InscripcionRequest,
  InscripcionDetalle,
} from "../modulos/Inscripciones/types/inscripciones.types";

const API_URL = `/Inscripciones`;

// Si q = "" (o q.trim() === ""), envía params: { q: undefined } → el backend recibe q=null → trae todos.
export const getEstudiantes = async (q = ""): Promise<Estudiante[]> => {
  const { data } = await instance.get<Estudiante[]>(`${API_URL}/estudiantes`, {
    params: { q: q.trim() || undefined },
  });
  return data;
};

export const getCursos = async (q = ""): Promise<Curso[]> => {
  const { data } = await instance.get<Curso[]>(`${API_URL}/obtener-cursos`, {
    params: { search: q.trim() || undefined },
  });
  return data;
};

// Insertar nueva inscripción
export const createInscripcion = async (
  payload: InscripcionRequest
): Promise<number> => {
  const { data } = await instance.post<number>(`${API_URL}`, payload);
  return data;
};

// Obtener inscripciones (con filtros opcionales)
export const getInscripciones = async (
  alumno?: string,
  cursoNombre?: string,
  fechaDesde?: string,
  fechaHasta?: string
): Promise<InscripcionDetalle[]> => {
  const { data } = await instance.get<InscripcionDetalle[]>(`${API_URL}`, {
    params: {
      alumno: alumno?.trim() || undefined,
      cursoNombre: cursoNombre?.trim() || undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    },
  });
  return data;
};

export const deleteInscripcion = async (id: number): Promise<void> => {
  await instance.delete(`${API_URL}/${id}`);
};
