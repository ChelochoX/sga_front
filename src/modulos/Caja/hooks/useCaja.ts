import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getMovimientosCaja,
  anularMovimiento,
  getAnulacionesCaja,
} from "../../../api/cajaService";
import { CajaMovimientoDto, CajaAnulacionDto } from "../types/caja.types";

interface FiltrosFecha {
  desde: string;
  hasta: string;
}

const obtenerFechaHoy = (): string => {
  return new Date().toISOString().split("T")[0] ?? "";
};

export const useCajaMovimientos = () => {
  const [movimientos, setMovimientos] = useState<CajaMovimientoDto[]>([]);
  const [anulaciones, setAnulaciones] = useState<CajaAnulacionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalDelDia, setTotalDelDia] = useState<number>(0);

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
        filtros.hasta,
      );

      setMovimientos(movimientos);
      setTotalDelDia(total);
    } catch (err) {
      console.error("❌ Error al obtener movimientos de caja:", err);
      setError("Error al obtener movimientos de caja.");
      setMovimientos([]);
      setTotalDelDia(0);
    } finally {
      setLoading(false);
    }
  };

  const buscarAnulaciones = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAnulacionesCaja(filtros.desde, filtros.hasta);
      setAnulaciones(data);
    } catch (err) {
      console.error("❌ Error al obtener anulaciones de caja:", err);
      setError("Error al obtener anulaciones de caja.");
      setAnulaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const anularFactura = async (idMovimiento: number, motivo: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await anularMovimiento({ idMovimiento, motivo });

      await Swal.fire({
        icon: "success",
        title: "¡Anulación realizada!",
        html: `<b>${response?.mensaje || "El movimiento fue anulado correctamente."}</b>`,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#7c3aed",
        timer: 3000,
        timerProgressBar: true,
      });

      await buscarMovimientos();
    } catch (err: any) {
      console.error("❌ Error al anular movimiento:", err);

      const mensaje =
        err?.response?.data?.Errors?.[0] ||
        err?.response?.data?.mensaje ||
        "No se pudo anular el movimiento.";

      setError(mensaje);

      await Swal.fire({
        icon: "error",
        title: "No se pudo anular",
        text: mensaje,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarMovimientos();
  }, []);

  return {
    movimientos,
    anulaciones,
    loading,
    error,
    filtros,
    setFiltros,
    totalDelDia,
    buscarMovimientos,
    buscarAnulaciones,
    anularFactura,
  };
};
