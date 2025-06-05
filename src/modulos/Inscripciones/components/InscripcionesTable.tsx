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
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { InscripcionDetalle } from "../types/inscripciones.types";

interface Props {
  data: InscripcionDetalle[];
  onDelete: (id: number) => void;
  loadingDelete: boolean;
}

export default function InscripcionesTable({
  data,
  onDelete,
  loadingDelete,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Si estamos en móvil, mostrar como tarjetas
  if (isMobile) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {data.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            Sin registros todavía
          </Typography>
        ) : (
          data.map((row) => (
            <Card key={row.idInscripcion} elevation={2}>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="body1" fontWeight={600}>
                      {row.nombreEstudiante}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Curso: {row.nombreCurso}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Fecha:</Typography>
                    <Typography variant="body2">
                      {new Date(row.fechaInscripcion).toLocaleDateString(
                        "es-PY"
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Estado:</Typography>
                    <Typography variant="body2">{row.estado}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">Descuentos:</Typography>
                    <Typography variant="body2">
                      Matrícula: {row.montoDescMatricula} / Práctica:{" "}
                      {row.montoDescPractica} / Descuento: {row.montoDescuento}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Tooltip title="Eliminar inscripción">
                      <IconButton
                        color="secondary"
                        onClick={() => onDelete(row.idInscripcion)}
                        disabled={loadingDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  }

  // En escritorio, mostrar tabla
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Estudiante</TableCell>
            <TableCell>Curso</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Descuentos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary">
                  Sin registros todavía
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.idInscripcion} hover>
                <TableCell>{row.nombreEstudiante}</TableCell>
                <TableCell>{row.nombreCurso}</TableCell>
                <TableCell>
                  {new Date(row.fechaInscripcion).toLocaleDateString("es-PY")}
                </TableCell>
                <TableCell>{row.estado}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  Matrícula: {row.montoDescMatricula} / Práctica:{" "}
                  {row.montoDescPractica} / Descuento: {row.montoDescuento}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Eliminar inscripción">
                    <IconButton
                      color="secondary"
                      onClick={() => onDelete(row.idInscripcion)}
                      disabled={loadingDelete}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
