import instance from "./axiosInstance";
import {
  FacturaContadoRequest,
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

export const getConfigDocumentoFiscal = async (codigoDocumento: string) => {
  const { data } = await instance.get(
    `${API_URL}/ConfiguracionDocumentoFiscal`,
    {
      params: { codigoDocumento },
    }
  );
  return data;
};

// Facturar seleccionados
export const facturarPagos = async (
  payload: FacturaContadoRequest
): Promise<any> => {
  const { data } = await instance.post(`${API_URL}/RegistrarFactura`, payload);
  return data;
};
