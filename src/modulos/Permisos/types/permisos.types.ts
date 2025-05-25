// src/modulos/Permisos/types/permisos.types.ts

export interface EntidadConRecursos {
  idEntidad: number;
  nombreEntidad: string;
  recursos: Recurso[];
}

export interface Recurso {
  idRecurso: number;
  nombreRecurso: string;
}

export interface AsignarPermisosRequest {
  idRol: number;
  permisos: number[]; // IDs de recursos
}
