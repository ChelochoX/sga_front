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
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CajaMovimientoDto } from "../types/caja.types";

interface Props {
  movimientos: CajaMovimientoDto[];
  onAnular: (idFactura: number) => void;
}

const formatFecha = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const CajaMovimientosTable: React.FC<Props> = ({ movimientos, onAnular }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [accionConfirmada, setAccionConfirmada] = useState<null | {
    idMovimiento: number;
    idFactura: number | null;
  }>(null);

  const handleAnular = (idMovimiento: number, idFactura: number | null) => {
    setAccionConfirmada({ idMovimiento, idFactura });
    setSnackbarOpen(true);
  };

  const confirmarAnulacion = () => {
    if (!accionConfirmada?.idFactura) return;
    onAnular(accionConfirmada.idFactura);
    setSnackbarOpen(false);
    setAccionConfirmada(null);
  };

  return (
    <Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          action={
            <>
              <Button color="inherit" size="small" onClick={confirmarAnulacion}>
                Anular
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => setSnackbarOpen(false)}
              >
                Cancelar
              </Button>
            </>
          }
        >
          ¿Estás seguro que deseas anular esta factura?
        </Alert>
      </Snackbar>

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
                    onClick={() =>
                      handleAnular(mov.idMovimiento, mov.idFactura ?? null)
                    }
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
                      onClick={() =>
                        handleAnular(mov.idMovimiento, mov.idFactura ?? null)
                      }
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
