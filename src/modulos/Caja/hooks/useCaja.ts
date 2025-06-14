import { useEffect, useState } from "react";
import { getMovimientosCaja, anularMovimiento } from "../../../api/cajaService";
import { CajaMovimientoDto } from "../types/caja.types";

export const useCajaMovimientos = () => {
  const [movimientos, setMovimientos] = useState<CajaMovimientoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDelDia, setTotalDelDia] = useState<number>(0);

  interface FiltrosFecha {
    desde: string;
    hasta: string;
  }

  const obtenerFechaHoy = (): string => {
    const fecha = new Date().toISOString().split("T");
    return fecha[0] || ""; // fallback seguro
  };

  const [filtros, setFiltros] = useState<FiltrosFecha>({
    desde: obtenerFechaHoy(),
    hasta: obtenerFechaHoy(),
  });

  const buscarMovimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { movimientos, total } = await getMovimientosCaja(
        filtros.desde,
        filtros.hasta
      );

      setMovimientos(movimientos); // ✅ aquí va el array
      setTotalDelDia(total);
    } catch (err) {
      console.error("❌ Error al obtener movimientos de caja:", err);
      setError("Error al obtener movimientos de caja");
    } finally {
      setLoading(false);
    }
  };

  const anularFactura = async (idMovimiento: number, motivo: string) => {
    try {
      await anularMovimiento({ idMovimiento, motivo });
      buscarMovimientos();
    } catch (error) {
      console.error("❌ Error al anular la factura:", error);
    }
  };

  useEffect(() => {
    buscarMovimientos();
  }, []);

  return {
    movimientos,
    loading,
    error,
    filtros,
    setFiltros,
    buscarMovimientos,
    anularFactura,
    totalDelDia,
  };
};
