import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  Divider,
  Box,
} from "@mui/material";
import { PagoDetalleDto } from "../types/pagos.types";

interface Props {
  open: boolean;
  onClose: () => void;
  detalles: PagoDetalleDto[];
  onFacturar: () => void;
}

export default function FacturaModal({
  open,
  onClose,
  detalles,
  onFacturar,
}: Props) {
  const total = detalles.reduce((acc, d) => acc + (d.monto || 0), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirmar Factura</DialogTitle>
      <DialogContent>
        <Typography mb={2} fontWeight={600}>
          Pagos a facturar:
        </Typography>
        <List>
          {detalles.map((d, idx) => (
            <ListItem key={idx}>
              <Box flex={1}>
                <Typography fontWeight={500}>{d.concepto}</Typography>
                <Typography variant="body2">
                  {d.monto?.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}
                  {" - "}Vencimiento:{" "}
                  {d.fechaVencimiento
                    ? new Date(d.fechaVencimiento).toLocaleDateString("es-PY")
                    : "-"}
                </Typography>
              </Box>
              <Typography variant="body2" color="secondary">
                {d.estado}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Typography fontWeight={600} fontSize={17}>
          Total a facturar:{" "}
          {total.toLocaleString("es-PY", {
            style: "currency",
            currency: "PYG",
          })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={onFacturar} color="primary" variant="contained">
          Confirmar y emitir factura
        </Button>
      </DialogActions>
    </Dialog>
  );
}
