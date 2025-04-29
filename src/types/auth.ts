export interface LoginRequest {
  Usuario: string;
  Contrasena: string;
}

export interface LoginSuccessResponse {
  parTokens: {
    bearerToken: string;
  };
}

export interface CambioContrasenaResponse {
  RequiereCambioContrasena: boolean;
  IdUsuario: number;
  NombreUsuario: string;
  Mensaje: string;
}
