export interface CajaMovimientoDto {
  idMovimiento: number;
  fecha: string; // ISO date string
  tipoMovimiento: string;
  monto: number;
  concepto: string;
  usuario: string;
  referencia: string;
  fechaCreacion: string;
  idFactura: number;
}

export interface CajaAnulacionDto {
  idAnulacion: number;
  idMovimiento: number;
  motivo: string;
  usuarioAnulacion: string;
  fechaAnulacion: string;
}
