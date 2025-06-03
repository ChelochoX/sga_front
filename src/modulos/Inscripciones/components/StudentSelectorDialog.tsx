import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Estudiante } from "../types/inscripciones.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (e: Estudiante) => void;
}

// mock hard‑coded students
const mockEstudiantes: Estudiante[] = [
  { idPersona: 21, nombres: "Ana", apellidos: "Benítez" },
  { idPersona: 34, nombres: "Juan", apellidos: "López" },
  { idPersona: 55, nombres: "María", apellidos: "Giménez" },
];

export default function StudentSelectorDialog({
  open,
  onClose,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");

  const filtrados = mockEstudiantes.filter((s) =>
    `${s.nombres} ${s.apellidos}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Seleccionar estudiante</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Buscar…"
          fullWidth
          margin="normal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombres</TableCell>
              <TableCell>Apellidos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.map((s) => (
              <TableRow
                hover
                key={s.idPersona}
                onClick={() => {
                  onSelect(s);
                  onClose();
                }}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{s.nombres}</TableCell>
                <TableCell>{s.apellidos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
