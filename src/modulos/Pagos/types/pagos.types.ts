export interface PagoDetalleDto {
  idPago: number;
  idInscripcion: number;
  idPersona: number;
  nombreEstudiante: string;
  deudaTotal: number;
  tipoCuenta: string;
  descuentoCabecera: number;
  observacion: string;
  idDetallePago?: number;
  concepto?: string;
  monto?: number;
  fechaVencimiento?: string; // ISO date string
  fechaPago?: string; // ISO date string
  tipoPago?: string;
  referencia?: string;
  voucherNumero?: string;
  estado?: string;
}
