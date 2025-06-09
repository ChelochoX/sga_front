import instance from "./axiosInstance";
import {
  PagoCabeceraDto,
  PagoFiltroRequest,
  ResultadoPagos,
  PagoDetalleDto,
} from "../modulos/Pagos/types/pagos.types";

const API_URL = "/Pagos";

// Pagos pendientes
export const getPagosPendientes = async (
  filtro: PagoFiltroRequest
): Promise<ResultadoPagos> => {
  const { data } = await instance.post<ResultadoPagos>(
    `${API_URL}/PagosPendientes`,
    filtro
  );
  return data;
};

// Pagos realizados
export const getPagosRealizados = async (
  filtro: PagoFiltroRequest
): Promise<ResultadoPagos> => {
  const { data } = await instance.post<ResultadoPagos>(
    `${API_URL}/PagosRealizados`,
    filtro
  );
  return data;
};

// Facturar seleccionados
export const facturarPagos = async (
  detalles: PagoDetalleDto[]
): Promise<any> => {
  const { data } = await instance.post(`/RegistrarFacturaContado`, {
    detalles,
  });
  return data;
};

export const getConfigDocumentoFiscal = async (codigoDocumento: string) => {
  const { data } = await instance.get(`/ConfiguracionDocumentoFiscal`, {
    params: { codigoDocumento },
  });
  return data;
};
