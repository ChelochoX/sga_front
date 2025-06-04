// src/api/inscripcionesService.ts
import instance from "./axiosInstance"; // <- ¡usamos la instancia global!
import {
  Estudiante,
  Curso,
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
