import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { Estudiante, Curso } from "../types/inscripciones.types";
import StudentSelectorDialog from "./StudentSelectorDialog";
// Make sure CourseSelectorDialog.tsx exists in the same folder, or update the path if it's elsewhere.
import CourseSelectorDialog from "./CourseSelectorDialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InscripcionForm({ open, onClose }: Props) {
  const [studentDlg, setStudentDlg] = useState(false);
  const [courseDlg, setCourseDlg] = useState(false);

  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [curso, setCurso] = useState<Curso | null>(null);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Nueva inscripción</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {/* Columna izquierda */}
            <Grid item xs={12} md={6} container spacing={2} direction="column">
              <Grid item sx={{ display: "flex", gap: 1 }}>
                <TextField
                  label="Estudiante"
                  value={
                    estudiante
                      ? `${estudiante.nombres} ${estudiante.apellidos}`
                      : ""
                  }
                  placeholder="Seleccionar…"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <Tooltip title="Buscar estudiante">
                  <IconButton
                    color="primary"
                    onClick={() => setStudentDlg(true)}
                  >
                    <PersonSearchIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item sx={{ display: "flex", gap: 1 }}>
                <TextField
                  label="Curso"
                  value={curso ? curso.nombre : ""}
                  placeholder="Seleccionar…"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <Tooltip title="Buscar curso">
                  <IconButton
                    color="primary"
                    onClick={() => setCourseDlg(true)}
                  >
                    <LibraryBooksIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <TextField
                  label="Estado"
                  select
                  fullWidth
                  defaultValue="Activa"
                >
                  <MenuItem value="Activa">Activa</MenuItem>
                  <MenuItem value="Inactiva">Inactiva</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Columna derecha – descuentos (solo visual) */}
            <Grid item xs={12} md={6} container spacing={2} direction="column">
              <Grid item>
                <TextField
                  label="Monto descuento"
                  type="number"
                  placeholder="0"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Motivo descuento"
                  placeholder="Promoción…"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Monto desc. práctica"
                  type="number"
                  placeholder="0"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Motivo desc. práctica"
                  placeholder="Motivo…"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Monto desc. matrícula"
                  type="number"
                  placeholder="0"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Motivo desc. matrícula"
                  placeholder="Motivo…"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" disabled={!estudiante || !curso}>
            Inscribir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Selectores */}
      <StudentSelectorDialog
        open={studentDlg}
        onClose={() => setStudentDlg(false)}
        onSelect={setEstudiante}
      />
      <CourseSelectorDialog
        open={courseDlg}
        onClose={() => setCourseDlg(false)}
        onSelect={setCurso}
      />
    </>
  );
}
