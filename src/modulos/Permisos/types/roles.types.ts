export interface RolDetalle {
  idRol: number;
  nombreRol: string;
  nombreUsuario: string;
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
export interface ActualizarRolesRequest {
  nombreUsuario: string;
  idsRoles: number[];
}
