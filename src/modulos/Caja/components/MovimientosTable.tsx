import React from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CajaMovimientoDto } from "../types/caja.types";

interface Props {
  movimientos: CajaMovimientoDto[];
}

const formatFecha = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return fecha;
  }
};

const CajaMovimientosTable: React.FC<Props> = ({ movimientos }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAnular = (idMovimiento: number) => {
    console.log("Anular movimiento con ID:", idMovimiento);
  };

  return (
    <Box>
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
