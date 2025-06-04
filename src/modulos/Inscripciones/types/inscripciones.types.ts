export interface Estudiante {
  idPersona: number;
  nombres: string;
  apellidos: string;
}

export interface Curso {
  idCurso: number;
  nombre: string;
  descripcion: string;
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

export interface InscripcionDetalle {
  idInscripcion: number;
  idPersona: number;
  nombreEstudiante: string;
  idCurso: number;
  nombreCurso: string;
  fechaInscripcion: string; // ISO
  estado: string;
  montoDescuento: number;
  motivoDescuento: string;
  montoDescPractica: number;
  motivoDescPractica: string;
  montoDescMatricula: number;
  motivoDescMatricula: string;
}
