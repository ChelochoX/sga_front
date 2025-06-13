import { useEffect, useState } from "react";
import { getMovimientosCaja, deleteFactura } from "../../../api/cajaService";
import { CajaMovimientoDto } from "../types/caja.types";

// ✅ Interfaz para los filtros de fecha
interface FiltrosFecha {
  desde: string;
  hasta: string;
}

// ✅ Función segura para obtener la fecha de hoy en formato yyyy-MM-dd
const obtenerFechaHoy = (): string => {
  const fecha = new Date().toISOString().split("T");
  return fecha[0] || ""; // fallback seguro
};

export const useCajaMovimientos = () => {
  const [movimientos, setMovimientos] = useState<CajaMovimientoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltrosFecha>({
    desde: obtenerFechaHoy(),
    hasta: obtenerFechaHoy(),
  });

  const buscarMovimientos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMovimientosCaja(filtros.desde, filtros.hasta);
      setMovimientos(data);
    } catch (err) {
      console.error("❌ Error al obtener movimientos de caja:", err);
      setError("Error al obtener movimientos de caja");
    } finally {
      setLoading(false);
    }
  };

  // función para anular
  const anularFactura = async (idFactura: number) => {
    try {
      setLoading(true);
      await deleteFactura(idFactura); // <- llamada al backend
      await buscarMovimientos(); // <- refresca la lista
    } catch (error) {
      console.error("❌ Error al anular factura:", error);
      setError("Ocurrió un error al intentar anular la factura.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarMovimientos(); // cargar al iniciar
  }, []);

  return {
    movimientos,
    loading,
    error,
    filtros,
    setFiltros,
    buscarMovimientos,
    anularFactura,
  };
};
