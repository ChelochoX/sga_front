import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { Inscripcion } from "../types/inscripciones.types";

interface Props {
  data: Inscripcion[];
}

export default function InscripcionesTable({ data }: Props) {
  return (
    <Paper elevation={1} sx={{ width: "100%", overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Estudiante</TableCell>
            <TableCell>Curso</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
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
                <TableCell>{row.estudiante}</TableCell>
                <TableCell>{row.curso}</TableCell>
                <TableCell>
                  {new Date(row.fechaInscripcion).toLocaleDateString("es-PY")}
                </TableCell>
                <TableCell>{row.estado}</TableCell>
                <TableCell>{/* acciones */}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
