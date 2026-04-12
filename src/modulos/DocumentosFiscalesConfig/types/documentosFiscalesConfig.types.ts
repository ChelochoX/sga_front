export interface TipoDocumentoFiscal {
  id: number;
  codigoDocumento: string;
  nombre: string;
}

export interface DocumentoFiscalConfig {
  id: number;
  tipoDocumentoId: number;
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
  activo: boolean;
  conceptoDocumento: string;
}

export interface DocumentoFiscalConfigRequest {
  tipoDocumentoId: number;
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
  activo: boolean;
  conceptoDocumento: string;
}

export interface DocumentoFiscalConfigFiltroRequest {
  conceptoDocumento?: string;
  tipoDocumentoId?: number;
  activo?: boolean;
}
