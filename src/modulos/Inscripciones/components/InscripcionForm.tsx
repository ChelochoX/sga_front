import React, { useEffect, useState } from "react";
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
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Estudiante,
  Curso,
  InscripcionRequest,
} from "../types/inscripciones.types";
import StudentSelectorDialog from "./StudentSelectorDialog";
import CourseSelectorDialog from "./CourseSelectorDialog";
import { useInscripciones } from "../hooks/useInscripciones";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type EstadoInscripcion = "Activa" | "Inactiva" | "Cancelada";
type NumberInput = number | "";

const toNumber = (value: NumberInput): number => (value === "" ? 0 : value);

export default function InscripcionForm({ open, onClose, onSuccess }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [studentDlg, setStudentDlg] = useState(false);
  const [courseDlg, setCourseDlg] = useState(false);

  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [estado, setEstado] = useState<EstadoInscripcion>("Activa");

  const [montoDescuento, setMontoDescuento] = useState<NumberInput>("");
  const [motivoDescuento, setMotivoDescuento] = useState("");
  const [montoPrac, setMontoPrac] = useState<NumberInput>("");
  const [motivoPrac, setMotivoPrac] = useState("");
  const [montoMat, setMontoMat] = useState<NumberInput>("");
  const [motivoMat, setMotivoMat] = useState("");

  const [errorMotivoDescuento, setErrorMotivoDescuento] = useState("");
  const [errorMotivoPrac, setErrorMotivoPrac] = useState("");
  const [errorMotivoMat, setErrorMotivoMat] = useState("");
  const [fechaInscripcion, setFechaInscripcion] = useState<Dayjs | null>(
    dayjs(),
  );

  const { insertarInscripcion, loading } = useInscripciones();

  useEffect(() => {
    if (!open) return;

    setEstudiante(null);
    setCurso(null);
    setEstado("Activa");
    setMontoDescuento("");
    setMotivoDescuento("");
    setMontoPrac("");
    setMotivoPrac("");
    setMontoMat("");
    setMotivoMat("");
    setErrorMotivoDescuento("");
    setErrorMotivoPrac("");
    setErrorMotivoMat("");
    setFechaInscripcion(dayjs());
  }, [open]);

  useEffect(() => {
    const descuento = toNumber(montoDescuento);
    const practica = toNumber(montoPrac);
    const matricula = toNumber(montoMat);

    setErrorMotivoDescuento(
      descuento > 0 && motivoDescuento.trim() === ""
        ? "Este campo es obligatorio cuando hay descuento."
        : "",
    );

    setErrorMotivoPrac(
      practica > 0 && motivoPrac.trim() === ""
        ? "Este campo es obligatorio cuando hay descuento de práctica."
        : "",
    );

    setErrorMotivoMat(
      matricula > 0 && motivoMat.trim() === ""
        ? "Este campo es obligatorio cuando hay descuento de matrícula."
        : "",
    );
  }, [
    montoDescuento,
    motivoDescuento,
    montoPrac,
    motivoPrac,
    montoMat,
    motivoMat,
  ]);

  const handleFocusSelectIfZero = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target.value === "0" || e.target.value === "0.00") {
      e.target.select();
    }
  };

  const handleNonNegativeNumberChange = (
    rawValue: string,
    setter: React.Dispatch<React.SetStateAction<NumberInput>>,
  ) => {
    if (rawValue === "") {
      setter("");
      return;
    }

    const parsed = Number(rawValue);

    if (isNaN(parsed)) return;
    if (parsed < 0) return;

    setter(parsed);
  };

  const isFormValid = (): boolean => {
    if (!estudiante || !curso || !fechaInscripcion) return false;

    if (toNumber(montoDescuento) > 0 && motivoDescuento.trim() === "")
      return false;
    if (toNumber(montoPrac) > 0 && motivoPrac.trim() === "") return false;
    if (toNumber(montoMat) > 0 && motivoMat.trim() === "") return false;

    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Complete los datos obligatorios antes de continuar.");
      return;
    }

    const payload: InscripcionRequest = {
      idPersona: estudiante!.idPersona,
      idCurso: curso!.idCurso,
      estado,
      fechaInscripcion: fechaInscripcion!.toDate().toISOString(),
      montoDescuento: toNumber(montoDescuento),
      motivoDescuento,
      montoDescuentoPractica: toNumber(montoPrac),
      motivoDescuentoPractica: motivoPrac,
      montoDescuentoMatricula: toNumber(montoMat),
      motivoDescuentoMatricula: motivoMat,
    };

    try {
      await insertarInscripcion(payload);
      toast.success("Inscripción creada correctamente");
      onClose();
      onSuccess();
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.message ||
        "Error al crear la inscripción. Verifique que la persona sea estudiante.";
      toast.error(mensaje);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="lg"
          fullScreen={fullScreen}
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: { xs: 0, sm: 3 },
              maxHeight: { xs: "100dvh", sm: "90dvh" },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            Nueva inscripción
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              p: { xs: 2, sm: 3 },
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2, height: "100%" }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    Datos principales
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <TextField
                          label="Estudiante"
                          value={
                            estudiante
                              ? `${estudiante.nombres} ${estudiante.apellidos}`
                              : ""
                          }
                          placeholder="Seleccionar estudiante"
                          fullWidth
                          InputProps={{ readOnly: true }}
                          size="small"
                        />
                        <Tooltip title="Buscar estudiante">
                          <IconButton
                            sx={{
                              bgcolor: "#f3e8ff",
                              color: "#5947f5",
                              "&:hover": { bgcolor: "#e9d5ff" },
                            }}
                            onClick={() => setStudentDlg(true)}
                          >
                            <PersonSearchIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <TextField
                          label="Curso"
                          value={curso ? curso.nombre : ""}
                          placeholder="Seleccionar curso"
                          fullWidth
                          InputProps={{ readOnly: true }}
                          size="small"
                        />
                        <Tooltip title="Buscar curso">
                          <IconButton
                            sx={{
                              bgcolor: "#eef2ff",
                              color: "#3b82f6",
                              "&:hover": { bgcolor: "#dbeafe" },
                            }}
                            onClick={() => setCourseDlg(true)}
                          >
                            <LibraryBooksIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Estado"
                        select
                        fullWidth
                        size="small"
                        value={estado}
                        onChange={(e) =>
                          setEstado(e.target.value as EstadoInscripcion)
                        }
                      >
                        <MenuItem value="Activa">Activa</MenuItem>
                        <MenuItem value="Inactiva">Inactiva</MenuItem>
                        <MenuItem value="Cancelada">Cancelada</MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Fecha de inscripción"
                        value={fechaInscripcion}
                        onChange={(value) =>
                          setFechaInscripcion(value as Dayjs | null)
                        }
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2, height: "100%" }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    Descuentos
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Monto descuento"
                        type="number"
                        fullWidth
                        size="small"
                        value={montoDescuento}
                        onChange={(e) =>
                          handleNonNegativeNumberChange(
                            e.target.value,
                            setMontoDescuento,
                          )
                        }
                        onFocus={handleFocusSelectIfZero}
                        inputProps={{ min: 0, step: "any" }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Motivo descuento"
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
                      <Divider />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Monto desc. práctica"
                        type="number"
                        fullWidth
                        size="small"
                        value={montoPrac}
                        onChange={(e) =>
                          handleNonNegativeNumberChange(
                            e.target.value,
                            setMontoPrac,
                          )
                        }
                        onFocus={handleFocusSelectIfZero}
                        inputProps={{ min: 0, step: "any" }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Motivo desc. práctica"
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
                      <Divider />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Monto desc. matrícula"
                        type="number"
                        fullWidth
                        size="small"
                        value={montoMat}
                        onChange={(e) =>
                          handleNonNegativeNumberChange(
                            e.target.value,
                            setMontoMat,
                          )
                        }
                        onFocus={handleFocusSelectIfZero}
                        inputProps={{ min: 0, step: "any" }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Motivo desc. matrícula"
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
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>

            <Button
              variant="contained"
              disabled={!isFormValid() || loading}
              onClick={handleSubmit}
              sx={{
                bgcolor: "#43a047",
                "&:hover": { bgcolor: "#388e3c" },
                minWidth: 120,
              }}
            >
              {loading ? "Guardando..." : "Inscribir"}
            </Button>
          </DialogActions>
        </Dialog>

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
      </LocalizationProvider>
    </>
  );
}
