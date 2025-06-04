// src/modulos/Inscripciones/components/InscripcionesTable.tsx
import React from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import { Inscripcion } from "../types/inscripciones.types";

interface Props {
  datos: Inscripcion[];
}

/**
 * Componente que renderiza:
 * - Una tabla responsive con scroll horizontal en Desktop
 * - Una lista de Cards en Móvil
 */
export default function InscripcionesTable({ datos }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Si no hay inscripciones, mostramos mensaje (aplica a ambos modos)
  if (datos.length === 0) {
    return (
      <Box
        component={Paper}
        sx={{
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">Sin registros todavía</Typography>
      </Box>
    );
  }

  // ——————————————————————————————————————————————————
  // 1) MODO MÓVIL: renderizamos Cards apiladas
  // ——————————————————————————————————————————————————
  if (isMobile) {
    return (
      <Grid container spacing={2}>
        {datos.map((insc, idx) => (
          <Grid item xs={12} key={insc.idInscripcion}>
            <Card elevation={2}>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  #{idx + 1}
                </Typography>
                <Typography variant="body1">
                  <strong>Estudiante:</strong> {insc.estudiante}
                </Typography>
                <Typography variant="body1">
                  <strong>Curso:</strong> {insc.curso}
                </Typography>
                <Typography variant="body1">
                  <strong>Fecha:</strong> {insc.fechaInscripcion}
                </Typography>
                <Typography variant="body1">
                  <strong>Estado:</strong> {insc.estado}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                {/* Aquí van tus botones de acción para cada inscripción */}
                <Button size="small" color="primary">
                  Editar
                </Button>
                <Button size="small" color="error">
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // ——————————————————————————————————————————————————
  // 2) MODO DESKTOP: renderizamos la tabla con scroll horizontal
  // ——————————————————————————————————————————————————
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        overflowX: "auto", // Scroll horizontal si es necesario
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Estudiante</TableCell>
            <TableCell>Curso</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {datos.map((insc, index) => (
            <TableRow hover key={insc.idInscripcion}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{insc.estudiante}</TableCell>
              <TableCell>{insc.curso}</TableCell>
              <TableCell>{insc.fechaInscripcion}</TableCell>
              <TableCell>{insc.estado}</TableCell>
              <TableCell align="center">
                {/* Ejemplos de botones; reemplaza según tu lógica */}
                <Button size="small" color="primary">
                  Editar
                </Button>
                <Button size="small" color="error">
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
