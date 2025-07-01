export interface PermisoAccion {
  nombreEntidad: string;
  acciones: string[];
}

export interface PermisoRol {
  nombreRol: string;
  nombreUsuario: string;
  entidades: PermisoAccion[];
}
