// src/components/FacturacionModal.tsx
import React from "react";
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
  Divider,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface DetalleItem {
  concepto: string;
  monto: number;
  iva?: number;
  tipoIva?: string; // "10%", "5%", "Exenta", etc.
}

interface ConfigDocumento {
  NumeroActual?: string;
  Timbrado?: string;
  RazonSocialEmisor?: string;
  RucEmisor?: string;
  DireccionEmisor?: string;
  VigenciaInicio?: string;
  VigenciaFin?: string;
  // agrega más si tu backend lo trae
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirmar: () => void;
  detalles: DetalleItem[];
  config?: ConfigDocumento | null;
  tipoFactura: string;
  fechaEmision?: string;
  loading?: boolean;
}

const FacturacionModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirmar,
  detalles,
  config,
  tipoFactura,
  fechaEmision,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const total = detalles.reduce((sum, d) => sum + (d.monto || 0), 0);

  // Calcular totales de IVA y exentas
  const totalIva10 = detalles
    .filter((d) => d.tipoIva === "10%")
    .reduce((sum, d) => sum + (d.iva || 0), 0);
  const totalIva5 = detalles
    .filter((d) => d.tipoIva === "5%")
    .reduce((sum, d) => sum + (d.iva || 0), 0);
  const totalExenta = detalles
    .filter((d) => d.tipoIva === "Exenta")
    .reduce((sum, d) => sum + (d.monto || 0), 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Typography fontWeight={700}>Confirmar Facturación</Typography>
      </DialogTitle>
      <DialogContent>
        {/* Encabezado de la factura */}
        {config && (
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2}
            mb={2}
          >
            <Chip
              label={<b>Nro. Factura: {config.NumeroActual ?? "A DEFINIR"}</b>}
              color="secondary"
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            />
            <Chip
              label={<b>Timbrado: {config.Timbrado ?? "No definido"}</b>}
              color="info"
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            />
            <Chip
              label={<b>Tipo: {tipoFactura}</b>}
              color="success"
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            />
            {fechaEmision && (
              <Chip
                label={<b>Fecha: {fechaEmision}</b>}
                color="default"
                sx={{ fontWeight: 500, fontSize: "1rem" }}
              />
            )}
          </Box>
        )}
        <Box mb={1}>
          <Typography fontWeight={600}>Cliente:</Typography>
          {/* Aquí ponés los datos del alumno o podés pasar el objeto cliente por prop */}
          <Typography>
            Nombre del alumno, RUC/Cédula, dirección (pendiente de integración)
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Typography fontWeight={600} mb={1}>
          Detalles a facturar:
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Concepto</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell align="center">IVA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detalles.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.concepto}</TableCell>
                <TableCell align="right">
                  {item.monto.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                    minimumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell align="center">{item.tipoIva || "-"}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="right">
                <b>Total Exenta</b>
              </TableCell>
              <TableCell align="right">
                <b>
                  {totalExenta.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                    minimumFractionDigits: 0,
                  })}
                </b>
              </TableCell>
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell align="right">
                <b>Total IVA 5%</b>
              </TableCell>
              <TableCell align="right">
                <b>
                  {totalIva5.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                    minimumFractionDigits: 0,
                  })}
                </b>
              </TableCell>
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell align="right">
                <b>Total IVA 10%</b>
              </TableCell>
              <TableCell align="right">
                <b>
                  {totalIva10.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                    minimumFractionDigits: 0,
                  })}
                </b>
              </TableCell>
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell align="right">
                <b>Total General</b>
              </TableCell>
              <TableCell align="right">
                <b>
                  {total.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                    minimumFractionDigits: 0,
                  })}
                </b>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirmar}
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

export default FacturacionModal;
