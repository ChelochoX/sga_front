import instance from "./axiosInstance";
import {
  FacturaContadoRequest,
  FacturarPagosResponse,
  PagoFiltroRequest,
  ResultadoPagos,
} from "../modulos/Pagos/types/pagos.types";

const API_URL = "/Pagos";

/**
 * POST /Pagos/PagosPendientes
 * Obtiene el listado paginado de pagos pendientes según los filtros enviados.
 */
export const getPagosPendientes = async (
  filtro: PagoFiltroRequest,
): Promise<ResultadoPagos> => {
  const { data } = await instance.post<ResultadoPagos>(
    `${API_URL}/PagosPendientes`,
    filtro,
  );
  return data;
};

/**
 * POST /Pagos/PagosRealizados
 * Obtiene el listado paginado de pagos ya realizados según los filtros enviados.
 */
export const getPagosRealizados = async (
  filtro: PagoFiltroRequest,
): Promise<ResultadoPagos> => {
  const { data } = await instance.post<ResultadoPagos>(
    `${API_URL}/PagosRealizados`,
    filtro,
  );
  return data;
};

/**
 * GET /Pagos/ConfiguracionDocumentoFiscal
 * Obtiene la configuración fiscal activa para el código de documento solicitado.
 */
export const getConfigDocumentoFiscal = async (codigoDocumento: string) => {
  const { data } = await instance.get(
    `${API_URL}/ConfiguracionDocumentoFiscal`,
    {
      params: { codigoDocumento },
    },
  );
  return data;
};

/**
 * POST /Pagos/RegistrarFactura
 * Registra la factura de los detalles seleccionados y devuelve el mensaje
 * junto con el id de la factura generada.
 */
export const facturarPagos = async (
  payload: FacturaContadoRequest,
): Promise<FacturarPagosResponse> => {
  const { data } = await instance.post<FacturarPagosResponse>(
    `${API_URL}/RegistrarFactura`,
    payload,
  );
  return data;
};
