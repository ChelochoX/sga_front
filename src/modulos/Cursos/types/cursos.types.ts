export interface Curso {
  id_curso: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  unidad_duracion: string;
  cantidad_cuota: number;
  monto_cuota: number;
  tiene_practica: boolean;
  costo_practica: number;
  fecha_inicio: string;
  fecha_fin: string;
  monto_matricula: number;
  activo: boolean;
}

export interface ObtenerCursosRequest {
  fechaInicio?: string | null;
  fechaFin?: string | null;
  activo?: boolean | null;
}

export interface CursoPayload {
  nombre: string;
  descripcion: string;
  duracion: number;
  unidadDuracion: string;
  cantidadCuota: number;
  montoMatricula: number;
  montoCuota: number;
  tienePractica: "S" | "N";
  costoPractica: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  activo: boolean;
}
