import instance from "./axiosInstance";
import {
  Curso,
  CursoListado,
  CursoPayload,
  ObtenerCursosRequest,
} from "../modulos/Cursos/types/cursos.types";

const API_URL = "/Cursos";

const parseBoolean = (value: any): boolean =>
  value === true || value === "S" || value === 1;

const mapConceptoFromApi = (c: any) => ({
  idCursoConcepto: c.idCursoConcepto,
  idCurso: c.idCurso,
  tipoConcepto: c.tipoConcepto,
  descripcion: c.descripcion ?? "",
  activo: parseBoolean(c.activo),
  vencimientos: (c.vencimientos ?? []).map((v: any) => ({
    idCursoConceptoVencimiento: v.idCursoConceptoVencimiento,
    nroOrden: Number(v.nroOrden ?? 0),
    monto: Number(v.monto ?? 0),
    fechaVencimiento: v.fechaVencimiento,
    descripcion: v.descripcion ?? "",
    activo: parseBoolean(v.activo),
  })),
});

const mapCursoListadoFromApi = (item: any): CursoListado => ({
  idCurso: item.idCurso,
  nombre: item.nombre,
  descripcion: item.descripcion ?? "",
  duracion: Number(item.duracion ?? 0),
  unidadDuracion: item.unidadDuracion,
  fechaInicio: item.fechaInicio,
  fechaFin: item.fechaFin,
  activo: parseBoolean(item.activo),
  conceptos: (item.conceptos ?? []).map(mapConceptoFromApi),
});

const mapCursoDetalleFromApi = (item: any): Curso => ({
  idCurso: item.idCurso,
  nombre: item.nombre,
  descripcion: item.descripcion ?? "",
  duracion: Number(item.duracion ?? 0),
  unidadDuracion: item.unidadDuracion,
  fechaInicio: item.fechaInicio,
  fechaFin: item.fechaFin,
  activo: parseBoolean(item.activo),
  conceptos: (item.conceptos ?? []).map(mapConceptoFromApi),
});

export const getCursos = async (
  params: ObtenerCursosRequest,
): Promise<CursoListado[]> => {
  try {
    const { data } = await instance.post(`${API_URL}/obtener-cursos`, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data.map(mapCursoListadoFromApi);
  } catch (error: any) {
    console.error("❌ Error al obtener cursos:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

export const getCursoById = async (id: number): Promise<Curso> => {
  try {
    const { data } = await instance.get(`${API_URL}/${id}`);
    return mapCursoDetalleFromApi(data);
  } catch (error: any) {
    console.error("❌ Error al obtener detalle del curso:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

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
