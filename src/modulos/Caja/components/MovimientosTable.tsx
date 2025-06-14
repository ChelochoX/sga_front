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
  useTheme,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CajaMovimientoDto } from "../types/caja.types";

interface Props {
  movimientos: CajaMovimientoDto[];
  onAnular: (idMovimiento: number, motivo: string) => void;
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

  const confirmarAnulacion = () => {
    if (!accionConfirmada || !motivoAnulacion.trim()) return;
    onAnular(accionConfirmada, motivoAnulacion.trim());
    setSnackbarOpen(false);
    setMotivoAnulacion("");
    setAccionConfirmada(null);
  };

  return (
    <Box>
      <Dialog
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
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
          <Button onClick={() => setSnackbarOpen(false)} color="secondary">
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
                  <strong>Monto:</strong> {mov.monto.toLocaleString()}
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
                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    color="error"
                    onClick={() => handleAnular(mov.idMovimiento)}
                  >
                    <DeleteIcon />
                  </IconButton>
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
                  <TableCell>{mov.monto.toLocaleString()}</TableCell>
                  <TableCell>{mov.concepto}</TableCell>
                  <TableCell>{mov.usuario}</TableCell>
                  <TableCell>{mov.referencia}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleAnular(mov.idMovimiento)}
                    >
                      <DeleteIcon />
                    </IconButton>
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
