import React, { useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import { useTheme } from "@mui/material/styles";
import { CajaMovimientoDto } from "../types/caja.types";

interface Props {
  movimientos: CajaMovimientoDto[];
  onAnular: (idMovimiento: number, motivo: string) => void;
  onImprimir: (idMovimiento: number) => void;
}

const formatFecha = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const CajaMovimientosTable: React.FC<Props> = ({
  movimientos = [],
  onAnular,
  onImprimir,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [accionConfirmada, setAccionConfirmada] = useState<number | null>(null);
  const [motivoAnulacion, setMotivoAnulacion] = useState("");

  const handleAnular = (idMovimiento: number) => {
    setAccionConfirmada(idMovimiento);
    setSnackbarOpen(true);
  };

  const cerrarDialogo = () => {
    setSnackbarOpen(false);
    setMotivoAnulacion("");
    setAccionConfirmada(null);
  };

  const confirmarAnulacion = () => {
    if (!accionConfirmada || !motivoAnulacion.trim()) return;

    onAnular(accionConfirmada, motivoAnulacion.trim());
    cerrarDialogo();
  };

  return (
    <Box>
      <Dialog
        open={snackbarOpen}
        onClose={cerrarDialogo}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar anulación</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Motivo de anulación"
            value={motivoAnulacion}
            onChange={(e) => setMotivoAnulacion(e.target.value)}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            ¿Estás seguro que deseas anular esta factura?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogo} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={confirmarAnulacion}
            color="error"
            variant="contained"
            disabled={!motivoAnulacion.trim()}
          >
            Anular
          </Button>
        </DialogActions>
      </Dialog>

      {isMobile ? (
        <Stack spacing={2}>
          {movimientos.map((mov) => (
            <Card key={mov.idMovimiento} variant="outlined">
              <CardContent>
                <Typography variant="body2" gutterBottom>
                  <strong>Fecha:</strong> {formatFecha(mov.fecha)}
                </Typography>
                <Typography variant="body2">
                  <strong>Tipo:</strong> {mov.tipoMovimiento}
                </Typography>
                <Typography variant="body2">
                  <strong>Monto:</strong> {mov.monto.toLocaleString("es-PY")}
                </Typography>
                <Typography variant="body2">
                  <strong>Concepto:</strong> {mov.concepto}
                </Typography>
                <Typography variant="body2">
                  <strong>Usuario:</strong> {mov.usuario}
                </Typography>
                <Typography variant="body2">
                  <strong>Referencia:</strong> {mov.referencia}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Tooltip title="Imprimir factura">
                    <IconButton
                      color="primary"
                      onClick={() => onImprimir(mov.idMovimiento)}
                    >
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Anular factura">
                    <IconButton
                      color="error"
                      onClick={() => handleAnular(mov.idMovimiento)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Concepto</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Referencia</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientos.map((mov) => (
                <TableRow key={mov.idMovimiento}>
                  <TableCell>{formatFecha(mov.fecha)}</TableCell>
                  <TableCell>{mov.tipoMovimiento}</TableCell>
                  <TableCell>{mov.monto.toLocaleString("es-PY")}</TableCell>
                  <TableCell>{mov.concepto}</TableCell>
                  <TableCell>{mov.usuario}</TableCell>
                  <TableCell>{mov.referencia}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Imprimir factura">
                      <IconButton
                        color="primary"
                        onClick={() => onImprimir(mov.idMovimiento)}
                      >
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Anular factura">
                      <IconButton
                        color="error"
                        onClick={() => handleAnular(mov.idMovimiento)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default CajaMovimientosTable;
