import instance from "./axiosInstance";
import {
  DocumentoFiscalConfig,
  DocumentoFiscalConfigFiltroRequest,
  DocumentoFiscalConfigRequest,
  TipoDocumentoFiscal,
} from "../modulos/DocumentosFiscalesConfig/types/documentosFiscalesConfig.types";

const API_URL = "/DocumentosFiscalesConfig";

export const getDocumentosFiscalesConfig = async (
  filtros?: DocumentoFiscalConfigFiltroRequest,
): Promise<DocumentoFiscalConfig[]> => {
  const { data } = await instance.get<DocumentoFiscalConfig[]>(API_URL, {
    params: {
      conceptoDocumento: filtros?.conceptoDocumento || undefined,
      tipoDocumentoId: filtros?.tipoDocumentoId || undefined,
      activo:
        filtros?.activo === undefined || filtros?.activo === null
          ? undefined
          : filtros.activo,
    },
  });

  return data;
};

export const getDocumentoFiscalConfigById = async (
  id: number,
): Promise<DocumentoFiscalConfig> => {
  const { data } = await instance.get<DocumentoFiscalConfig>(
    `${API_URL}/${id}`,
  );
  return data;
};

export const createDocumentoFiscalConfig = async (
  payload: DocumentoFiscalConfigRequest,
): Promise<number> => {
  const { data } = await instance.post<number>(API_URL, payload);
  return data;
};

export const updateDocumentoFiscalConfig = async (
  id: number,
  payload: DocumentoFiscalConfigRequest,
): Promise<void> => {
  await instance.put(`${API_URL}/${id}`, payload);
};

export const deleteDocumentoFiscalConfig = async (
  id: number,
): Promise<void> => {
  await instance.delete(`${API_URL}/${id}`);
};

export const getTiposDocumentoFiscal = async (): Promise<
  TipoDocumentoFiscal[]
> => {
  const { data } = await instance.get<TipoDocumentoFiscal[]>(
    `${API_URL}/tipos-documento`,
  );
  return data;
};
