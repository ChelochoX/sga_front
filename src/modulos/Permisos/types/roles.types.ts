export interface RolDetalle {
  idRol: number;
  nombreRol: string;
  entidades: EntidadDetalle[];
}

export interface EntidadDetalle {
  idEntidad: number;
  nombreEntidad: string;
  acciones: string[];
}

export interface RolCatalogo {
  idRol: number;
  nombreRol: string;
}
