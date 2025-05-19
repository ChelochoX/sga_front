// permisos.types.ts

export interface Recurso {
  idRecurso: number;
  nombreRecurso: string;
}

export interface Entidad {
  idEntidad: number;
  nombreEntidad: string;
}

export interface Permiso {
  idPermiso: number;
  idRol: number;
  idRecurso: number;
  idEntidad: number;
}
