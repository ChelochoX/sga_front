// src/modulos/Inscripciones/components/CourseSelectorDialog.tsx
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
import { Curso } from "../types/inscripciones.types";
import { useInscripciones } from "../hooks/useInscripciones"; // mismo hook

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (curso: Curso) => void;
}

export default function CourseSelectorDialog({
  open,
  onClose,
  onSelect,
}: Props) {
  // ① Estado local para el filtro de texto
  const [query, setQuery] = useState("");
  // 🚀 Desestructuramos solo lo que necesitamos para cursos
  const {
    cursos,
    loading,
    refetchCursos, // para cargar/filtrar cursos
  } = useInscripciones();

  const didInitialFetch = useRef(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      refetchCursos("");
      didInitialFetch.current = true;
    } else {
      didInitialFetch.current = false;
    }
  }, [open, refetchCursos, setQuery]);

  useEffect(() => {
    if (open && didInitialFetch.current) {
      refetchCursos(query);
    }
  }, [open, query, refetchCursos]);

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

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cursos.map((c) => (
                <TableRow
                  hover
                  key={c.idCurso}
                  onClick={() => {
                    onSelect(c);
                    onClose();
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{c.nombre}</TableCell>
                  <TableCell>{c.descripcion}</TableCell>
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
