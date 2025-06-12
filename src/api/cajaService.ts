import instance from "./axiosInstance";
import { CajaMovimientoDto } from "../modulos/Caja/types/caja.types";

const API_URL = `/Caja`;

// ✅ Obtener movimientos de caja por rango de fechas
export const getMovimientosCaja = async (
  desde: string,
  hasta: string
): Promise<CajaMovimientoDto[]> => {
  try {
    const { data } = await instance.get(`${API_URL}/movimientos`, {
      params: { desde, hasta },
    });
    return data;
  } catch (error: any) {
    console.error("❌ Error al obtener movimientos de caja:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};
