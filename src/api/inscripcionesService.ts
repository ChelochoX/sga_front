import instance from "./axiosInstance";
import {
  Estudiante,
  Curso,
  InscripcionRequest,
  InscripcionDetalle,
  InscripcionPlanPagoPreview,
} from "../modulos/Inscripciones/types/inscripciones.types";

const API_URL = "/Inscripciones";

const normalizeQuery = (value?: string) => value?.trim() || undefined;

export const getEstudiantes = async (q = ""): Promise<Estudiante[]> => {
  const { data } = await instance.get<Estudiante[]>(`${API_URL}/estudiantes`, {
    params: { q: normalizeQuery(q) },
  });
  return data;
};

export const getCursos = async (q = ""): Promise<Curso[]> => {
  const { data } = await instance.get<Curso[]>(`${API_URL}/obtener-cursos`, {
    params: { search: normalizeQuery(q) },
  });
  return data;
};

export const previewPlanPago = async (
  payload: InscripcionRequest,
): Promise<InscripcionPlanPagoPreview> => {
  const { data } = await instance.post<InscripcionPlanPagoPreview>(
    `${API_URL}/preview-plan-pago`,
    payload,
  );
  return data;
};

export const createInscripcion = async (
  payload: InscripcionRequest,
): Promise<number> => {
  const { data } = await instance.post<number>(API_URL, payload);
  return data;
};

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

export const deleteInscripcion = async (id: number): Promise<void> => {
  await instance.delete(`${API_URL}/${id}`);
};
