import React, { useEffect, useMemo, useState } from "react";
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
  Chip,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import EventIcon from "@mui/icons-material/Event";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DiscountIcon from "@mui/icons-material/Discount";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Estudiante,
  Curso,
  InscripcionRequest,
  InscripcionPlanPagoPreview,
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

const formatearMonto = (monto?: number | null) =>
  `Gs. ${(Number(monto ?? 0) || 0).toLocaleString("es-PY")}`;

const formatearFecha = (fecha?: string | null) => {
  if (!fecha) return "—";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-PY");
};

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

  const [preview, setPreview] = useState<InscripcionPlanPagoPreview | null>(
    null,
  );
  const [loadingPreview, setLoadingPreview] = useState(false);

  const { insertarInscripcion, obtenerPreviewPlanPago, loading } =
    useInscripciones();

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
    setPreview(null);
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

    if (Number.isNaN(parsed)) return;
    if (parsed < 0) return;

    setter(parsed);
  };

  const isFormValid = (): boolean => {
    if (!estudiante || !curso || !fechaInscripcion) return false;

    if (toNumber(montoDescuento) > 0 && motivoDescuento.trim() === "") {
      return false;
    }

    if (toNumber(montoPrac) > 0 && motivoPrac.trim() === "") {
      return false;
    }

    if (toNumber(montoMat) > 0 && motivoMat.trim() === "") {
      return false;
    }

    return true;
  };

  const payload: InscripcionRequest | null = useMemo(() => {
    if (!estudiante || !curso || !fechaInscripcion) return null;

    return {
      idPersona: estudiante.idPersona,
      idCurso: curso.idCurso,
      estado,
      fechaInscripcion: fechaInscripcion.toDate().toISOString(),
      montoDescuento: toNumber(montoDescuento),
      motivoDescuento,
      montoDescuentoPractica: toNumber(montoPrac),
      motivoDescuentoPractica: motivoPrac,
      montoDescuentoMatricula: toNumber(montoMat),
      motivoDescuentoMatricula: motivoMat,
    };
  }, [
    estudiante,
    curso,
    estado,
    fechaInscripcion,
    montoDescuento,
    motivoDescuento,
    montoPrac,
    motivoPrac,
    montoMat,
    motivoMat,
  ]);

  const handlePreview = async () => {
    if (!payload || !isFormValid()) {
      toast.error("Complete los datos obligatorios antes de previsualizar.");
      return;
    }

    try {
      setLoadingPreview(true);
      const data = await obtenerPreviewPlanPago(payload);
      setPreview(data);
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.message ||
        "No se pudo obtener la previsualización del plan de pagos.";
      toast.error(mensaje);
      setPreview(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleSubmit = async () => {
    if (!payload || !isFormValid()) {
      toast.error("Complete los datos obligatorios antes de continuar.");
      return;
    }

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
                        label="Monto descuento por cuota"
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
                        label="Motivo descuento por cuota"
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

              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Previsualización del plan de pagos
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={handlePreview}
                      disabled={!isFormValid() || loadingPreview}
                      sx={{
                        bgcolor: "#7b1fa2",
                        "&:hover": { bgcolor: "#6a1b9a" },
                        fontWeight: 700,
                      }}
                    >
                      {loadingPreview ? "Calculando..." : "Ver plan de pagos"}
                    </Button>
                  </Box>

                  {loadingPreview ? (
                    <Box display="flex" justifyContent="center" py={4}>
                      <CircularProgress />
                    </Box>
                  ) : !preview ? (
                    <Typography color="text.secondary">
                      Seleccioná estudiante, curso y descuentos para ver cómo se
                      generarán los pagos.
                    </Typography>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1.2,
                          mb: 2,
                        }}
                      >
                        <Chip
                          icon={<ReceiptLongIcon />}
                          label={`${preview.cantidadPagos} pagos`}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          icon={<PaymentsIcon />}
                          label={`Total ${formatearMonto(preview.total)}`}
                          color="success"
                          variant="outlined"
                        />
                        <Chip
                          icon={<DiscountIcon />}
                          label={`Descuento ${formatearMonto(
                            preview.descuentoAplicado,
                          )}`}
                          color="warning"
                          variant="outlined"
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 1fr",
                          },
                          gap: 1.5,
                        }}
                      >
                        {preview.detalles.map((item, index) => (
                          <Paper
                            key={`${item.tipoConcepto}-${item.nroOrden}-${index}`}
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: "#fcfcfd",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Typography sx={{ fontWeight: 700 }}>
                                {item.concepto}
                              </Typography>

                              <Chip
                                size="small"
                                label={item.tipoConcepto}
                                variant="outlined"
                              />
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                              <b>Orden:</b> {item.nroOrden}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              <b>Vencimiento:</b>{" "}
                              {formatearFecha(item.fechaVencimiento)}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              <b>Monto original:</b>{" "}
                              {formatearMonto(item.montoOriginal)}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              <b>Descuento:</b>{" "}
                              {formatearMonto(item.descuentoAplicado)}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{ mt: 0.5, fontWeight: 700 }}
                            >
                              <b>Monto final:</b>{" "}
                              {formatearMonto(item.montoFinal)}
                            </Typography>
                          </Paper>
                        ))}
                      </Box>
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              onClick={onClose}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#d32f2f",
                "&:hover": { bgcolor: "#b71c1c" },
                color: "#fff",
                fontWeight: 600,
                minWidth: 120,
                borderRadius: 2,
                boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              disabled={!isFormValid() || loading}
              onClick={handleSubmit}
              sx={{
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#125ea8" },
                color: "#fff",
                fontWeight: 600,
                minWidth: 120,
                borderRadius: 2,
                boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
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
