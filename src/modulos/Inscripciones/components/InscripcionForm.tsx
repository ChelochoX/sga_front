// ===========================================================================
// Front-end: components/InscripcionForm.tsx
// (Validación de campos de motivo de descuento para que no queden vacíos)
// ===========================================================================
import React, { useState, useEffect } from "react";
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
  useMediaQuery,
  Box,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import {
  Estudiante,
  Curso,
  InscripcionRequest,
} from "../types/inscripciones.types";
import StudentSelectorDialog from "./StudentSelectorDialog";
import CourseSelectorDialog from "./CourseSelectorDialog";
import { useInscripciones } from "../hooks/useInscripciones";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // callback para recargar tabla después de insertar
}

export default function InscripcionForm({ open, onClose, onSuccess }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Diálogos de selección
  const [studentDlg, setStudentDlg] = useState(false);
  const [courseDlg, setCourseDlg] = useState(false);

  // Campos del formulario
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [estado, setEstado] = useState<"Activa" | "Inactiva" | "Cancelada">(
    "Activa"
  );
  const [montoDescuento, setMontoDescuento] = useState<number>(0);
  const [motivoDescuento, setMotivoDescuento] = useState<string>("");
  const [montoPrac, setMontoPrac] = useState<number>(0);
  const [motivoPrac, setMotivoPrac] = useState<string>("");
  const [montoMat, setMontoMat] = useState<number>(0);
  const [motivoMat, setMotivoMat] = useState<string>("");

  const { insertarInscripcion, loading } = useInscripciones();

  // Estado para errores de validación
  const [errorMotivoDescuento, setErrorMotivoDescuento] = useState<string>("");
  const [errorMotivoPrac, setErrorMotivoPrac] = useState<string>("");
  const [errorMotivoMat, setErrorMotivoMat] = useState<string>("");

  // Habilitar botón "Inscribir" solo si:
  // - Estudiante y curso elegidos
  // - Si montoDescuento > 0, motivoDescuento no vacío
  // - Si montoPrac > 0, motivoPrac no vacío
  // - Si montoMat > 0, motivoMat no vacío
  const isFormValid = (): boolean => {
    if (!estudiante || !curso) return false;

    if (montoDescuento > 0 && motivoDescuento.trim() === "") return false;
    if (montoPrac > 0 && motivoPrac.trim() === "") return false;
    if (montoMat > 0 && motivoMat.trim() === "") return false;

    return true;
  };

  // Resetear errores cada vez que cambian los montos o motivos
  useEffect(() => {
    if (montoDescuento > 0 && motivoDescuento.trim() === "") {
      setErrorMotivoDescuento("Este campo es obligatorio cuando hay descuento");
    } else {
      setErrorMotivoDescuento("");
    }

    if (montoPrac > 0 && motivoPrac.trim() === "") {
      setErrorMotivoPrac(
        "Este campo es obligatorio cuando hay descuento de práctica"
      );
    } else {
      setErrorMotivoPrac("");
    }

    if (montoMat > 0 && motivoMat.trim() === "") {
      setErrorMotivoMat(
        "Este campo es obligatorio cuando hay descuento de matrícula"
      );
    } else {
      setErrorMotivoMat("");
    }
  }, [
    montoDescuento,
    motivoDescuento,
    montoPrac,
    motivoPrac,
    montoMat,
    motivoMat,
  ]);

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error(
        "Por favor, complete los campos obligatorios de motivo de descuento."
      );
      return;
    }

    const payload: InscripcionRequest = {
      idPersona: estudiante!.idPersona,
      idCurso: curso!.idCurso,
      estado,
      montoDescuento,
      motivoDescuento,
      montoDescuentoPractica: montoPrac,
      motivoDescuentoPractica: motivoPrac,
      montoDescuentoMatricula: montoMat,
      motivoDescuentoMatricula: motivoMat,
    };

    try {
      await insertarInscripcion(payload);
      toast.success("Inscripción creada correctamente");
      onClose();
      onSuccess();
    } catch (error) {
      toast.error("Error al crear la inscripción");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        fullScreen={fullScreen}
      >
        <DialogTitle>Nueva inscripción</DialogTitle>
        <DialogContent>
          <Box p={fullScreen ? 0 : 2}>
            <Grid container spacing={2}>
              {/* ────────────────────────────────────────────────────────────
                  Columna izquierda: Estudiante, Curso, Estado
                  ──────────────────────────────────────────────────────────── */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  {/* Campo Estudiante + búsqueda */}
                  <Grid item xs={12} container spacing={1} alignItems="center">
                    <Grid item xs>
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
                        size="small"
                      />
                    </Grid>
                    <Grid item>
                      <Tooltip title="Buscar estudiante">
                        <IconButton
                          color="primary"
                          onClick={() => setStudentDlg(true)}
                        >
                          <PersonSearchIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>

                  {/* Campo Curso + búsqueda */}
                  <Grid item xs={12} container spacing={1} alignItems="center">
                    <Grid item xs>
                      <TextField
                        label="Curso"
                        value={curso ? curso.nombre : ""}
                        placeholder="Seleccionar…"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        size="small"
                      />
                    </Grid>
                    <Grid item>
                      <Tooltip title="Buscar curso">
                        <IconButton
                          color="primary"
                          onClick={() => setCourseDlg(true)}
                        >
                          <LibraryBooksIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>

                  {/* Campo Estado */}
                  <Grid item xs={12}>
                    <TextField
                      label="Estado"
                      select
                      fullWidth
                      size="small"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value as any)}
                    >
                      <MenuItem value="Activa">Activa</MenuItem>
                      <MenuItem value="Inactiva">Inactiva</MenuItem>
                      <MenuItem value="Cancelada">Cancelada</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              {/* ────────────────────────────────────────────────────────────
                  Columna derecha – Descuentos (con validación)
                  ──────────────────────────────────────────────────────────── */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      label="Monto descuento"
                      type="number"
                      placeholder="0"
                      fullWidth
                      size="small"
                      value={montoDescuento}
                      onChange={(e) =>
                        setMontoDescuento(Number(e.target.value))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Motivo descuento"
                      placeholder="Promoción…"
                      fullWidth
                      size="small"
                      value={motivoDescuento}
                      onChange={(e) => setMotivoDescuento(e.target.value)}
                      error={errorMotivoDescuento !== ""}
                    />
                    {errorMotivoDescuento && (
                      <FormHelperText error>
                        {errorMotivoDescuento}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Monto desc. práctica"
                      type="number"
                      placeholder="0"
                      fullWidth
                      size="small"
                      value={montoPrac}
                      onChange={(e) => setMontoPrac(Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Motivo desc. práctica"
                      placeholder="Motivo…"
                      fullWidth
                      size="small"
                      value={motivoPrac}
                      onChange={(e) => setMotivoPrac(e.target.value)}
                      error={errorMotivoPrac !== ""}
                    />
                    {errorMotivoPrac && (
                      <FormHelperText error>{errorMotivoPrac}</FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Monto desc. matrícula"
                      type="number"
                      placeholder="0"
                      fullWidth
                      size="small"
                      value={montoMat}
                      onChange={(e) => setMontoMat(Number(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Motivo desc. matrícula"
                      placeholder="Motivo…"
                      fullWidth
                      size="small"
                      value={motivoMat}
                      onChange={(e) => setMotivoMat(e.target.value)}
                      error={errorMotivoMat !== ""}
                    />
                    {errorMotivoMat && (
                      <FormHelperText error>{errorMotivoMat}</FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!isFormValid() || loading}
            onClick={handleSubmit}
          >
            {loading ? "Guardando..." : "Inscribir"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogos de selección de estudiante y curso */}
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
