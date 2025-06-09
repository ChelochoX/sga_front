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
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirmar: () => void;
  detalles: DetalleItem[];
  nroFactura: string;
  tipoFactura: string;
  fechaEmision?: string;
  loading?: boolean;
  onFacturar: () => Promise<void>;
}

export const FacturacionModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirmar,
  detalles,
  nroFactura,
  tipoFactura,
  fechaEmision,
  loading = false,
  onFacturar,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const total = detalles.reduce((sum, d) => sum + (d.monto || 0), 0);

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
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
          mb={2}
        >
          <Chip
            label={<b>Nro. Factura: {nroFactura}</b>}
            color="secondary"
            sx={{ fontWeight: 600, fontSize: "1rem" }}
          />
          <Chip
            label={<b>Tipo: {tipoFactura}</b>}
            color="info"
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
        <Divider sx={{ mb: 2 }} />
        <Typography fontWeight={600} mb={1}>
          Detalles a facturar:
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Concepto</TableCell>
              <TableCell align="right">Monto</TableCell>
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
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="right">
                <b>Total:</b>
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
