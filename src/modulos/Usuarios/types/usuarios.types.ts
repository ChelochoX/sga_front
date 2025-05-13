export interface Usuario {
  idUsuario: number;
  idPersona: number;
  idRol: number;
  nombreUsuario: string;
  contrasenaHash: string;
  estado?: string;
  fechaCreacion: string;
  fechaModificacion?: string;
  contrasenaTemporal: string;
  requiereCambioContrasena: boolean;
}
