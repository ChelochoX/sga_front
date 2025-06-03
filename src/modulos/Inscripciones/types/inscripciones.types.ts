export interface Estudiante {
  idPersona: number;
  nombres: string;
  apellidos: string;
}

export interface Curso {
  idCurso: number;
  nombre: string;
}

export interface InscripcionRequest {
  idPersona: number;
  idCurso: number;
  estado: "Activa" | "Inactiva" | "Cancelada";
  montoDescuento: number;
  motivoDescuento: string;
  montoDescuentoPractica: number;
  motivoDescuentoPractica: string;
  montoDescuentoMatricula: number;
  motivoDescuentoMatricula: string;
}

export interface InscripcionResponse extends InscripcionRequest {
  idInscripcion: number;
  fechaInscripcion: string; // ISO
}

// 👉 Tipo que usa la tabla: incluye nombres de estudiante y curso para mostrar.
export interface Inscripcion extends InscripcionResponse {
  estudiante: string;
  curso: string;
}
