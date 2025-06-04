// src/modulos/Inscripciones/components/StudentSelectorDialog.tsx
import React, { useEffect, useRef, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Estudiante } from "../types/inscripciones.types";
import { useInscripciones } from "../hooks/useInscripciones"; // el hook que ya maneja ambos

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (e: Estudiante) => void;
}

export default function StudentSelectorDialog({
  open,
  onClose,
  onSelect,
}: Props) {
  // ① Estado local para el texto de búsqueda (query)
  const [query, setQuery] = useState("");

  // 🚀 Desestructuramos solo lo que necesitamos para estudiantes
  const {
    estudiantes,
    loading,
    refetchEstudiantes, // antes era “refetch”
  } = useInscripciones();

  const didInitialFetch = useRef(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      refetchEstudiantes("");
      didInitialFetch.current = true;
    } else {
      didInitialFetch.current = false;
    }
  }, [open, refetchEstudiantes, setQuery]);

  useEffect(() => {
    if (open && didInitialFetch.current) {
      refetchEstudiantes(query);
    }
  }, [open, query, refetchEstudiantes]);

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

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombres</TableCell>
                <TableCell>Apellidos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estudiantes.map((s) => (
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
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
