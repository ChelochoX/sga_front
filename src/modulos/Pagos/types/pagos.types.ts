// Representa el detalle individual de cada cuota, vencimiento, etc.
export interface PagoDetalleDto {
  idDetallePago?: number;
  concepto?: string;
  monto?: number;
  fechaVencimiento?: string | null;
  fechaPago?: string | null;
  tipoPago?: string | null;
  referencia?: string | null;
  voucherNumero?: string | null;
  estado?: string;
}

export interface PagoCabeceraDto {
  idPago: number;
  idInscripcion: number;
  nombreEstudiante: string;
  direccionEstudiante: string;
  rucEstudiante: string;
  telefonoEstudiante: string;
  nombreCurso: string;
  deudaTotal: number;
  tipoCuenta: string;
  descuentoCabecera: number;
  observacion: string;
  detalles: PagoDetalleDto[];
}

// Respuesta paginada del backend
export interface ResultadoPagos {
  items: PagoCabeceraDto[];
  total: number;
}

// El filtro para la búsqueda (igual que antes)
export interface PagoFiltroRequest {
  nombreEstudiante?: string;
  fechaVencimiento?: string;
  pageNumber: number;
  pageSize: number;
}

export interface DocumentoFiscalConfig {
  id: number;
  tipoDocumento: string;
  sucursal: string;
  puntoExpedicion: string;
  timbrado: string;
  numeroActual: number;
  numeroInicio: number;
  numeroFin: number;
  vigenciaDesde: string;
  vigenciaHasta: string;
  rucEmisor: string;
  razonSocialEmisor: string;
  direccionEmisor: string;
}
