export interface Persona {
  id: number;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  fechaRegistro: string;
  cedula: string;
  ruc: string;
  digitoVerificador: number;
}
