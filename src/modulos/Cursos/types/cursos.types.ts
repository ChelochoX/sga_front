import { Dayjs } from "dayjs";

export type TipoConcepto = "Matricula" | "Cuota" | "Practica" | "DerechoExamen";

export interface CursoConceptoVencimiento {
  idCursoConceptoVencimiento?: number;
  nroOrden: number;
  monto: number;
  fechaVencimiento: string;
  descripcion: string;
  activo: boolean;
}

export interface CursoConcepto {
  idCursoConcepto?: number;
  idCurso?: number;
  tipoConcepto: TipoConcepto;
  descripcion: string;
  activo: boolean;
  vencimientos: CursoConceptoVencimiento[];
}

export interface Curso {
  idCurso: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  unidadDuracion: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  conceptos: CursoConcepto[];
}

export interface CursoListado {
  idCurso: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  unidadDuracion: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  conceptos: CursoConcepto[];
}

export interface ObtenerCursosRequest {
  fechaInicio?: string | null;
  fechaFin?: string | null;
  activo?: boolean | null;
}

export interface CursoConceptoVencimientoPayload {
  nroOrden: number;
  monto: number;
  fechaVencimiento: string;
  descripcion: string;
  activo: boolean;
}

export interface CursoConceptoPayload {
  tipoConcepto: TipoConcepto;
  descripcion: string;
  activo: boolean;
  vencimientos: CursoConceptoVencimientoPayload[];
}

export interface CursoPayload {
  nombre: string;
  descripcion: string;
  duracion: number;
  unidadDuracion: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  activo: boolean;
  conceptos: CursoConceptoPayload[];
}

export interface CursoConceptoVencimientoForm {
  nroOrden: number;
  monto: number | "";
  fechaVencimiento: Dayjs | null;
  descripcion: string;
  activo: boolean;
}

export interface CursoConceptoForm {
  tipoConcepto: TipoConcepto;
  descripcion: string;
  activo: boolean;
  vencimientos: CursoConceptoVencimientoForm[];
}

export interface CursoFormValues {
  nombre: string;
  descripcion: string;
  duracion: number | "";
  unidadDuracion: string;
  fechaInicio: Dayjs | null;
  fechaFin: Dayjs | null;
  activo: boolean;
  conceptos: CursoConceptoForm[];
}
