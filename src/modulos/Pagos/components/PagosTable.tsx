import React from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PagoDetalleDto } from "../types/pagos.types";

interface Props {
  data: PagoDetalleDto[];
  loading?: boolean;
  emptyText?: string;
}

export default function PagosTable({
  data,
  loading = false,
  emptyText,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {loading ? (
          <Typography align="center">Cargando...</Typography>
        ) : data.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            {emptyText || "Sin registros todavía"}
          </Typography>
        ) : (
          data.map((row) => (
            <Card
              key={row.idDetallePago || `${row.idPago}-${row.concepto}`}
              elevation={2}
            >
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography fontWeight={600}>
                      {row.nombreEstudiante}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Concepto: {row.concepto}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Monto:</Typography>
                    <Typography variant="body2">
                      {typeof row.monto === "number"
                        ? row.monto.toLocaleString("es-PY", {
                            style: "currency",
                            currency: "PYG",
                          })
                        : "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Vencimiento:</Typography>
                    <Typography variant="body2">
                      {row.fechaVencimiento
                        ? new Date(row.fechaVencimiento).toLocaleDateString(
                            "es-PY"
                          )
                        : "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Pago:</Typography>
                    <Typography variant="body2">
                      {row.fechaPago
                        ? new Date(row.fechaPago).toLocaleDateString("es-PY")
                        : "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Estado:</Typography>
                    <Typography variant="body2">{row.estado}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">Tipo de Pago:</Typography>
                    <Typography variant="body2">{row.tipoPago}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Estudiante</TableCell>
            <TableCell>Concepto</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Vencimiento</TableCell>
            <TableCell>Pago</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Tipo de Pago</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="text.secondary">
                  Cargando...
                </Typography>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="text.secondary">
                  {emptyText || "Sin registros todavía"}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={row.idDetallePago || `${row.idPago}-${row.concepto}`}
                hover
              >
                <TableCell>{row.nombreEstudiante}</TableCell>
                <TableCell>{row.concepto}</TableCell>
                <TableCell>
                  {typeof row.monto === "number"
                    ? row.monto.toLocaleString("es-PY", {
                        style: "currency",
                        currency: "PYG",
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  {row.fechaVencimiento
                    ? new Date(row.fechaVencimiento).toLocaleDateString("es-PY")
                    : "-"}
                </TableCell>
                <TableCell>
                  {row.fechaPago
                    ? new Date(row.fechaPago).toLocaleDateString("es-PY")
                    : "-"}
                </TableCell>
                <TableCell>{row.estado}</TableCell>
                <TableCell>{row.tipoPago}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
