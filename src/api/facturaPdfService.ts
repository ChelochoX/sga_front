import instance from "./axiosInstance";

/**
 * Abre un PDF recibido como Blob en una nueva pestaña.
 * Si el navegador bloquea la pestaña, intenta descargar el archivo.
 */
const abrirBlobPdf = (blob: Blob, nombreArchivo: string) => {
  const fileURL = window.URL.createObjectURL(blob);
  const nuevaVentana = window.open(fileURL, "_blank");

  if (!nuevaVentana) {
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  setTimeout(() => window.URL.revokeObjectURL(fileURL), 1000);
};

/**
 * GET /Facturas/{idFactura}/pdf
 * Obtiene y abre el PDF de una factura específica por su id.
 */
export const descargarPdfFactura = async (idFactura: number) => {
  const response = await instance.get(`/Facturas/${idFactura}/pdf`, {
    responseType: "blob",
  });

  abrirBlobPdf(response.data, `factura-${idFactura}.pdf`);
};

/**
 * GET /Facturas/movimiento/{idMovimiento}/pdf
 * Obtiene y abre el PDF de la factura asociada a un movimiento de caja.
 */
export const descargarPdfFacturaPorMovimiento = async (
  idMovimiento: number,
) => {
  const response = await instance.get(
    `/Facturas/movimiento/${idMovimiento}/pdf`,
    {
      responseType: "blob",
    },
  );

  abrirBlobPdf(response.data, `movimiento-${idMovimiento}-factura.pdf`);
};

/**
 * GET /Facturas/anulacion/{idAnulacion}/pdf
 * Obtiene y abre el PDF de la factura asociada a un registro de anulación.
 */
export const descargarPdfFacturaPorAnulacion = async (idAnulacion: number) => {
  const response = await instance.get(
    `/Facturas/anulacion/${idAnulacion}/pdf`,
    {
      responseType: "blob",
    },
  );

  abrirBlobPdf(response.data, `anulacion-${idAnulacion}-factura.pdf`);
};
