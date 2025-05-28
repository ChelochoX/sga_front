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
}

export interface ObtenerCursosRequest {
  fechaInicio: string; // Formato "yyyy-MM-dd"
  fechaFin?: string | null; // Opcional
}
