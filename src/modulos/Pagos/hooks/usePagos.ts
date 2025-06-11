import { useState } from "react";
import {
  getPagosPendientes,
  getPagosRealizados,
  getConfigDocumentoFiscal,
} from "../../../api/pagosService";
import { PagoCabeceraDto, PagoFiltroRequest } from "../types/pagos.types";

export const usePagos = () => {
  const [pagosPendientes, setPagosPendientes] = useState<PagoCabeceraDto[]>([]);
  const [pagosRealizados, setPagosRealizados] = useState<PagoCabeceraDto[]>([]);
  const [totalPendientes, setTotalPendientes] = useState(0);
  const [totalRealizados, setTotalRealizados] = useState(0);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPagosPendientes = async (filtro: PagoFiltroRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPagosPendientes(filtro);
      setPagosPendientes(data.items);
      setTotalPendientes(data.total);
    } catch (err: any) {
      setError("Error al obtener pagos pendientes");
    } finally {
      setLoading(false);
    }
  };

  const fetchPagosRealizados = async (filtro: PagoFiltroRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPagosRealizados(filtro);
      setPagosRealizados(data.items);
      setTotalRealizados(data.total);
    } catch (err: any) {
      setError("Error al obtener pagos realizados");
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async (codigoDocumento: string) => {
    setLoading(true);
    try {
      const data = await getConfigDocumentoFiscal(codigoDocumento);
      setConfig(data); // Esto lo guarda en el state
    } catch (err) {
      console.error("Error al obtener configuración del documento fiscal", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    pagosPendientes,
    pagosRealizados,
    totalPendientes,
    totalRealizados,
    loading,
    error,
    fetchPagosPendientes,
    fetchPagosRealizados,
    config,
    fetchConfig,
  };
};
