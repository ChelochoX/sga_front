import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Grid,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  Paper,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DocumentoFiscalConfig,
  FacturaContadoRequest,
} from "../types/pagos.types";

interface DetalleItem {
  concepto: string;
  monto: number;
  iva?: number;
  tipoIva?: string;
  idPago: number;
  idDetallePago: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirmar: (payload: FacturaContadoRequest) => void;
  detalles: DetalleItem[];
  config?: DocumentoFiscalConfig | null;
  fechaEmision?: string;
  loading?: boolean;
  estudiante: string;
  direccion: string;
  ruc: string;
  telefono: string;
}

const formatearFecha = (fecha?: string | null) => {
  if (!fecha) return "";
  const soloFecha = fecha.includes("T") ? fecha.split("T")[0] : fecha;
  if (!soloFecha) return "";

  const partes = soloFecha.split("-");
  if (partes.length === 3) {
    const [anio, mes, dia] = partes;
    return `${dia}/${mes}/${anio}`;
  }

  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("es-PY");
};

const formatearNumero = (monto?: number | null) =>
  (Number(monto ?? 0) || 0).toLocaleString("es-PY");

const FacturaModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirmar,
  detalles,
  config,
  fechaEmision,
  loading = false,
  estudiante,
  direccion,
  ruc,
  telefono,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tipoFactura, setTipoFactura] = useState<"CONTADO" | "CREDITO">(
    "CONTADO",
  );

  const total = detalles.reduce((sum, d) => sum + (d.monto || 0), 0);

  const totalIva10 = detalles
    .filter((d) => d.tipoIva === "10%")
    .reduce((sum, d) => sum + (d.iva || 0), 0);

  const totalIva5 = detalles
    .filter((d) => d.tipoIva === "5%")
    .reduce((sum, d) => sum + (d.iva || 0), 0);

  const totalExenta = detalles
    .filter((d) => d.tipoIva === "Exenta")
    .reduce((sum, d) => sum + (d.monto || 0), 0);

  const totalIva = totalIva10 + totalIva5;

  const facturaNro = config
    ? `${config.sucursal}-${config.puntoExpedicion}-${String(
        config.numeroActual,
      ).padStart(7, "0")}`
    : "A definir";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Typography fontWeight={700}>Factura</Typography>
      </DialogTitle>

      <DialogContent>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  Fecha de Emisión: {formatearFecha(fechaEmision)}
                </Typography>
                <Typography variant="body2">
                  RUC emisor: {config?.rucEmisor || "-"}
                </Typography>
                <Typography variant="body2">
                  Razón social: {config?.razonSocialEmisor || "-"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} textAlign="right">
                <Typography variant="h6" fontWeight={700}>
                  Factura Nro: {facturaNro}
                </Typography>
                <Typography variant="body2">
                  Timbrado: {config?.timbrado || "-"}
                </Typography>
                <Typography variant="body2">
                  Vigencia:{" "}
                  {config?.vigenciaDesde && config?.vigenciaHasta
                    ? `${formatearFecha(config.vigenciaDesde)} al ${formatearFecha(
                        config.vigenciaHasta,
                      )}`
                    : "-"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <b>Cliente:</b> {estudiante}
                </Typography>
                <Typography variant="body2">
                  <b>Dirección:</b> {direccion}
                </Typography>
                <Typography variant="body2">
                  <b>RUC:</b> {ruc}
                </Typography>
                <Typography variant="body2">
                  <b>Teléfono:</b> {telefono}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" fontWeight={600}>
                  Condición de Venta:
                </Typography>
                <Box display="flex" gap={2} alignItems="center" mb={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tipoFactura === "CONTADO"}
                        onChange={() => setTipoFactura("CONTADO")}
                        size="small"
                      />
                    }
                    label="Contado"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tipoFactura === "CREDITO"}
                        onChange={() => setTipoFactura("CREDITO")}
                        size="small"
                      />
                    }
                    label="Crédito"
                  />
                </Box>

                <Typography variant="body2">
                  <b>Tipo de Transacción:</b> Venta de servicios educativos
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography fontWeight={600} mb={1}>
              Detalles
            </Typography>

            {isMobile ? (
              <Stack spacing={2}>
                {detalles.map((item, idx) => (
                  <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2">
                      <b>Código:</b> 4900270{idx + 1}
                    </Typography>
                    <Typography variant="body2">
                      <b>Descripción:</b> {item.concepto}
                    </Typography>
                    <Typography variant="body2">
                      <b>Unidad:</b> Unidad
                    </Typography>
                    <Typography variant="body2">
                      <b>Cantidad:</b> 1
                    </Typography>
                    <Typography variant="body2">
                      <b>Precio Unitario:</b> {formatearNumero(item.monto)}
                    </Typography>
                    <Typography variant="body2">
                      <b>Descuento:</b> 0
                    </Typography>
                    <Typography variant="body2">
                      <b>Exentas:</b>{" "}
                      {item.tipoIva === "Exenta"
                        ? formatearNumero(item.monto)
                        : 0}
                    </Typography>
                    <Typography variant="body2">
                      <b>5%:</b>{" "}
                      {item.tipoIva === "5%" ? formatearNumero(item.monto) : 0}
                    </Typography>
                    <Typography variant="body2">
                      <b>10%:</b>{" "}
                      {item.tipoIva === "10%" ? formatearNumero(item.monto) : 0}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Unidad</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Precio Unitario</TableCell>
                    <TableCell align="right">Descuento</TableCell>
                    <TableCell align="right">Exentas</TableCell>
                    <TableCell align="right">5%</TableCell>
                    <TableCell align="right">10%</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {detalles.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>4900270{idx + 1}</TableCell>
                      <TableCell>{item.concepto}</TableCell>
                      <TableCell>Unidad</TableCell>
                      <TableCell align="right">1</TableCell>
                      <TableCell align="right">
                        {formatearNumero(item.monto)}
                      </TableCell>
                      <TableCell align="right">0</TableCell>
                      <TableCell align="right">
                        {item.tipoIva === "Exenta"
                          ? formatearNumero(item.monto)
                          : 0}
                      </TableCell>
                      <TableCell align="right">
                        {item.tipoIva === "5%"
                          ? formatearNumero(item.monto)
                          : 0}
                      </TableCell>
                      <TableCell align="right">
                        {item.tipoIva === "10%"
                          ? formatearNumero(item.monto)
                          : 0}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell colSpan={8} align="right">
                      <b>Total IVA:</b>
                    </TableCell>
                    <TableCell align="right">
                      {formatearNumero(totalIva)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={8} align="right">
                      <b>Total General:</b>
                    </TableCell>
                    <TableCell align="right">
                      {formatearNumero(total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>

        <Button
          onClick={() => {
            if (!config) return;

            const payload: FacturaContadoRequest = {
              sucursal: config.sucursal ?? "",
              caja: config.puntoExpedicion ?? "",
              numero: String(config.numeroActual ?? ""),
              rucCliente: ruc,
              nombreCliente: estudiante,
              tipoFactura,
              totalFactura: total,
              totalIva10,
              totalIva5,
              totalExenta,
              observacion:
                "Generación de pagos desde el módulo de pagos - cuenta corriente",
              detalles: detalles.map((d) => ({
                concepto: d.concepto,
                monto: d.monto,
                iva: d.iva ?? 0,
                tipoIva: d.tipoIva ?? "10%",
                idPago: d.idPago,
                idDetallePago: d.idDetallePago,
                observacion: "",
              })),
            };

            onConfirmar(payload);
          }}
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ fontWeight: 700, borderRadius: 999 }}
        >
          {loading ? <CircularProgress size={22} /> : "Confirmar y Facturar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacturaModal;
