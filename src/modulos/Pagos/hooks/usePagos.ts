import { useState } from "react";
import {
  getPagosPendientes,
  getPagosRealizados,
} from "../../../api/pagosService";
import { PagoDetalleDto } from "../types/pagos.types";

export const usePagos = () => {
  const [pagosPendientes, setPagosPendientes] = useState<PagoDetalleDto[]>([]);
  const [pagosRealizados, setPagosRealizados] = useState<PagoDetalleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPagosPendientes = async (
    nombreEstudiante?: string,
    fechaVencimiento?: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPagosPendientes(
        nombreEstudiante,
        fechaVencimiento,
        pageNumber,
        pageSize
      );
      setPagosPendientes(data);
    } catch (err: any) {
      setError("Error al obtener pagos pendientes");
    } finally {
      setLoading(false);
    }
  };

  const fetchPagosRealizados = async (
    nombreEstudiante?: string,
    fechaVencimiento?: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPagosRealizados(
        nombreEstudiante,
        fechaVencimiento,
        pageNumber,
        pageSize
      );
      setPagosRealizados(data);
    } catch (err: any) {
      setError("Error al obtener pagos realizados");
    } finally {
      setLoading(false);
    }
  };

  return {
    pagosPendientes,
    pagosRealizados,
    loading,
    error,
    fetchPagosPendientes,
    fetchPagosRealizados,
  };
};
