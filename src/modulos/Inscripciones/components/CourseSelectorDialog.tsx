import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Curso } from "../types/inscripciones.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (c: Curso) => void;
}

const mockCursos: Curso[] = [
  { idCurso: 5, nombre: "React Básico" },
  { idCurso: 7, nombre: "Node.js Avanzado" },
  { idCurso: 9, nombre: "SQL Server" },
];

export default function CourseSelectorDialog({
  open,
  onClose,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const filtrados = mockCursos.filter((c) =>
    c.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Seleccionar curso</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Buscar…"
          fullWidth
          margin="normal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <List>
          {filtrados.map((c) => (
            <ListItemButton
              key={c.idCurso}
              onClick={() => {
                onSelect(c);
                onClose();
              }}
            >
              <ListItemText primary={c.nombre} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
