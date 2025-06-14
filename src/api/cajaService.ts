import instance from "./axiosInstance";
import { CajaMovimientoDto } from "../modulos/Caja/types/caja.types";

const API_URL = `/Caja`;

// ✅ Obtener movimientos de caja por rango de fechas
export const getMovimientosCaja = async (
  desde: string,
  hasta: string
): Promise<{ movimientos: CajaMovimientoDto[]; total: number }> => {
  const { data } = await instance.get(`${API_URL}/movimientos`, {
    params: { desde, hasta },
  });

  const movimientos: CajaMovimientoDto[] = Array.isArray(data) ? data : [data]; // por si viene un solo objeto

  const total = movimientos.reduce((acc, cur) => acc + cur.monto, 0);

  return { movimientos, total };
};

export const anularMovimiento = async (payload: {
  idMovimiento: number;
  motivo: string;
}): Promise<void> => {
  await instance.post(`${API_URL}/anular-movimiento`, payload);
};
