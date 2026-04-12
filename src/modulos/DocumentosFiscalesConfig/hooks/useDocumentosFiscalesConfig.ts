import { useCallback, useState } from "react";
import {
  createDocumentoFiscalConfig,
  deleteDocumentoFiscalConfig,
  getDocumentoFiscalConfigById,
  getDocumentosFiscalesConfig,
  getTiposDocumentoFiscal,
  updateDocumentoFiscalConfig,
} from "../../../api/documentosFiscalesConfigService";
import {
  DocumentoFiscalConfig,
  DocumentoFiscalConfigFiltroRequest,
  DocumentoFiscalConfigRequest,
  TipoDocumentoFiscal,
} from "../types/documentosFiscalesConfig.types";

export const useDocumentosFiscalesConfig = () => {
  const [items, setItems] = useState<DocumentoFiscalConfig[]>([]);
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumentoFiscal[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(
    async (filtros?: DocumentoFiscalConfigFiltroRequest) => {
      setLoading(true);
      try {
        const data = await getDocumentosFiscalesConfig(filtros);
        setItems(data);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchTiposDocumento = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTiposDocumentoFiscal();
      setTiposDocumento(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerPorId = useCallback(async (id: number) => {
    setLoading(true);
    try {
      return await getDocumentoFiscalConfigById(id);
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = useCallback(async (payload: DocumentoFiscalConfigRequest) => {
    setLoading(true);
    try {
      return await createDocumentoFiscalConfig(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizar = useCallback(
    async (id: number, payload: DocumentoFiscalConfigRequest) => {
      setLoading(true);
      try {
        await updateDocumentoFiscalConfig(id, payload);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const eliminar = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await deleteDocumentoFiscalConfig(id);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    items,
    tiposDocumento,
    loading,
    fetchItems,
    fetchTiposDocumento,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
  };
};
