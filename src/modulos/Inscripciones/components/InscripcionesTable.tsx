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
} from "@mui/material";
import { InscripcionDetalle } from "../types/inscripciones.types";

interface Props {
  data: InscripcionDetalle[];
}

export default function InscripcionesTable({ data }: Props) {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
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
                <TableCell>{row.idInscripcion}</TableCell>
                <TableCell>{row.nombreEstudiante}</TableCell>
                <TableCell>{row.nombreCurso}</TableCell>
                <TableCell>
                  {new Date(row.fechaInscripcion).toLocaleDateString("es-PY")}
                </TableCell>
                <TableCell>{row.estado}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  Matricula: {row.montoDescMatricula} / Práctica:{" "}
                  {row.montoDescPractica} / Descuento: {row.montoDescuento}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
