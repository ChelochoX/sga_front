import instance from "./axiosInstance";
import { PagoDetalleDto } from "../modulos/Pagos/types/pagos.types";

// Base URL (si querés puedes usar process.env.VITE_API_URL + '/Pagos' si tu instance no lo tiene ya)
const API_URL = `/Pagos`;

// Obtener pagos pendientes
export const getPagosPendientes = async (
  nombreEstudiante?: string,
  fechaVencimiento?: string,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PagoDetalleDto[]> => {
  const { data } = await instance.get<PagoDetalleDto[]>(
    `${API_URL}/PagosPendientes`,
    {
      params: {
        nombreEstudiante: nombreEstudiante?.trim() || undefined,
        fechaVencimiento: fechaVencimiento || undefined,
        pageNumber,
        pageSize,
      },
    }
  );
  return data;
};

// Obtener pagos realizados
export const getPagosRealizados = async (
  nombreEstudiante?: string,
  fechaVencimiento?: string,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PagoDetalleDto[]> => {
  const { data } = await instance.get<PagoDetalleDto[]>(
    `${API_URL}/PagosRealizados`,
    {
      params: {
        nombreEstudiante: nombreEstudiante?.trim() || undefined,
        fechaVencimiento: fechaVencimiento || undefined,
        pageNumber,
        pageSize,
      },
    }
  );
  return data;
};
