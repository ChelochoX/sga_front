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

// Representa el detalle enviado al backend para la generación de factura
export interface FacturaDetalleRequest {
  concepto: string;
  monto: number;
  iva: number; // 👈 nuevo
  tipoIva: string; // 👈 nuevo ("10%", "5%", "Exenta")
  idPago: number;
  idDetallePago: number;
  observacion: string;
}

// Representa la cabecera de la factura para el endpoint /RegistrarFacturaContado
export interface FacturaContadoRequest {
  sucursal: string;
  caja: string;
  numero: string;
  rucCliente: string;
  nombreCliente: string;
  tipoFactura: string; // 👈 nuevo ("CONTADO" o "CREDITO")
  totalFactura: number;
  totalIva10: number; // 👈 nuevo
  totalIva5?: number; // opcional si en el sistema todavía no se usa
  totalExenta?: number; // opcional también
  observacion: string;
  detalles: FacturaDetalleRequest[];
}
export interface FacturarPagosResponse {
  mensaje: string;
  idFactura: number;
}
