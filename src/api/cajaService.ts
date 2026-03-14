import instance from "./axiosInstance";
import {
  CajaMovimientoDto,
  CajaAnulacionDto,
} from "../modulos/Caja/types/caja.types";

const API_URL = "/Caja";

/**
 * GET /Caja/movimientos
 * Obtiene los movimientos de caja filtrados por rango de fechas.
 */
export const getMovimientosCaja = async (
  desde: string,
  hasta: string,
): Promise<{ movimientos: CajaMovimientoDto[]; total: number }> => {
  const { data } = await instance.get(`${API_URL}/movimientos`, {
    params: { desde, hasta },
  });

  const movimientos: CajaMovimientoDto[] = Array.isArray(data) ? data : [data];
  const total = movimientos.reduce((acc, item) => acc + item.monto, 0);

  return { movimientos, total };
};

/**
 * POST /Caja/anular-movimiento
 * Anula un movimiento de caja enviando el motivo de anulación.
 */
export const anularMovimiento = async (payload: {
  idMovimiento: number;
  motivo: string;
}): Promise<{ mensaje: string }> => {
  const { data } = await instance.post("/Caja/anular-movimiento", payload);
  return data;
};

/**
 * GET /Caja/anulaciones
 * Obtiene el listado de anulaciones de caja por rango de fechas.
 */
export const getAnulacionesCaja = async (
  desde: string,
  hasta: string,
): Promise<CajaAnulacionDto[]> => {
  const { data } = await instance.get(`${API_URL}/anulaciones`, {
    params: { desde, hasta },
  });

  return Array.isArray(data) ? data : [];
};
