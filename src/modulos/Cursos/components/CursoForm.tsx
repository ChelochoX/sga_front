import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Paper,
  Divider,
  MenuItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";

import {
  CursoFormValues,
  CursoConceptoForm,
  CursoConceptoVencimientoForm,
  TipoConcepto,
} from "../types/cursos.types";

interface CursoFormProps {
  initialValues?: Partial<CursoFormValues>;
  onCancel: () => void;
  onSubmit: (data: CursoFormValues) => Promise<void> | void;
  modo?: "crear" | "editar";
}

type AutoCuotaConfig = {
  cantidad: number | "";
  monto: number | "";
  primerVencimiento: Dayjs | null;
};

const unidades = ["Horas", "Dias", "Semanas", "Meses"];

const tiposConcepto: TipoConcepto[] = [
  "Matricula",
  "Cuota",
  "Practica",
  "DerechoExamen",
];

const defaultVencimiento = (nroOrden = 1): CursoConceptoVencimientoForm => ({
  nroOrden,
  monto: "",
  fechaVencimiento: null,
  descripcion: "",
  activo: true,
});

const defaultConcepto = (tipo: TipoConcepto): CursoConceptoForm => ({
  tipoConcepto: tipo,
  descripcion:
    tipo === "Matricula"
      ? "Matrícula"
      : tipo === "Cuota"
        ? "Cuotas"
        : tipo === "Practica"
          ? "Prácticas"
          : "Derecho de examen",
  activo: true,
  vencimientos: tipo === "Cuota" ? [] : [defaultVencimiento(1)],
});

const buildInitialValues = (
  initialValues?: Partial<CursoFormValues>,
): CursoFormValues => ({
  nombre: initialValues?.nombre ?? "",
  descripcion: initialValues?.descripcion ?? "",
  duracion: initialValues?.duracion ?? "",
  unidadDuracion: initialValues?.unidadDuracion ?? "Meses",
  fechaInicio: initialValues?.fechaInicio ?? null,
  fechaFin: initialValues?.fechaFin ?? null,
  activo: initialValues?.activo ?? true,
  conceptos: initialValues?.conceptos ?? [],
});

export const CursoForm: React.FC<CursoFormProps> = ({
  initialValues,
  onCancel,
  onSubmit,
  modo = "crear",
}) => {
  const [values, setValues] = useState<CursoFormValues>(
    buildInitialValues(initialValues),
  );
  const [submitting, setSubmitting] = useState(false);

  const [autoCuotas, setAutoCuotas] = useState<Record<number, AutoCuotaConfig>>(
    {},
  );

  const tiposExistentes = useMemo(
    () => values.conceptos.map((c) => c.tipoConcepto),
    [values.conceptos],
  );

  const handleFieldChange = (
    field: keyof Omit<
      CursoFormValues,
      "conceptos" | "fechaInicio" | "fechaFin"
    >,
    value: string | number | boolean,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (
    field: "fechaInicio" | "fechaFin",
    value: Dayjs | null,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const agregarConcepto = (tipo: TipoConcepto) => {
    if (tiposExistentes.includes(tipo)) return;

    setValues((prev) => {
      const nuevoIndex = prev.conceptos.length;

      if (tipo === "Cuota") {
        setAutoCuotas((prevAuto) => ({
          ...prevAuto,
          [nuevoIndex]: {
            cantidad: "",
            monto: "",
            primerVencimiento: null,
          },
        }));
      }

      return {
        ...prev,
        conceptos: [...prev.conceptos, defaultConcepto(tipo)],
      };
    });
  };

  const eliminarConcepto = (conceptoIndex: number) => {
    setValues((prev) => ({
      ...prev,
      conceptos: prev.conceptos.filter((_, i) => i !== conceptoIndex),
    }));

    setAutoCuotas((prev) => {
      const nuevo: Record<number, AutoCuotaConfig> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const index = Number(key);
        if (index < conceptoIndex) nuevo[index] = value;
        if (index > conceptoIndex) nuevo[index - 1] = value;
      });
      return nuevo;
    });
  };

  const handleConceptoChange = (
    conceptoIndex: number,
    field: keyof Omit<CursoConceptoForm, "vencimientos">,
    value: string | boolean,
  ) => {
    setValues((prev) => {
      const conceptos = [...prev.conceptos];
      const concepto = conceptos[conceptoIndex];

      if (!concepto) return prev;

      conceptos[conceptoIndex] = {
        ...concepto,
        [field]: value,
      };

      return { ...prev, conceptos };
    });
  };

  const agregarVencimientoManual = (conceptoIndex: number) => {
    setValues((prev) => {
      const conceptos = [...prev.conceptos];
      const concepto = conceptos[conceptoIndex];

      if (!concepto) return prev;

      const nroOrden = concepto.vencimientos.length + 1;

      conceptos[conceptoIndex] = {
        ...concepto,
        vencimientos: [...concepto.vencimientos, defaultVencimiento(nroOrden)],
      };

      return { ...prev, conceptos };
    });
  };

  const eliminarVencimiento = (
    conceptoIndex: number,
    vencimientoIndex: number,
  ) => {
    setValues((prev) => {
      const conceptos = [...prev.conceptos];
      const concepto = conceptos[conceptoIndex];

      if (!concepto) return prev;

      const nuevos = concepto.vencimientos
        .filter((_, i) => i !== vencimientoIndex)
        .map((v, idx) => ({
          ...v,
          nroOrden: idx + 1,
        }));

      conceptos[conceptoIndex] = {
        ...concepto,
        vencimientos: nuevos,
      };

      return { ...prev, conceptos };
    });
  };

  const handleVencimientoChange = (
    conceptoIndex: number,
    vencimientoIndex: number,
    field: keyof CursoConceptoVencimientoForm,
    value: string | number | boolean | Dayjs | null,
  ) => {
    setValues((prev) => {
      const conceptos = [...prev.conceptos];
      const concepto = conceptos[conceptoIndex];

      if (!concepto) return prev;

      const vencimientos = [...concepto.vencimientos];
      const vencimiento = vencimientos[vencimientoIndex];

      if (!vencimiento) return prev;

      vencimientos[vencimientoIndex] = {
        ...vencimiento,
        [field]: value,
      };

      conceptos[conceptoIndex] = {
        ...concepto,
        vencimientos,
      };

      return { ...prev, conceptos };
    });
  };

  const handleAutoCuotaChange = (
    conceptoIndex: number,
    field: keyof AutoCuotaConfig,
    value: number | "" | Dayjs | null,
  ) => {
    setAutoCuotas((prev) => ({
      ...prev,
      [conceptoIndex]: {
        cantidad: prev[conceptoIndex]?.cantidad ?? "",
        monto: prev[conceptoIndex]?.monto ?? "",
        primerVencimiento: prev[conceptoIndex]?.primerVencimiento ?? null,
        [field]: value,
      },
    }));
  };

  const generarCuotas = (conceptoIndex: number) => {
    const config = autoCuotas[conceptoIndex];

    if (!config) return;

    const cantidad = Number(config.cantidad || 0);
    const monto = Number(config.monto || 0);
    const primerVencimiento = config.primerVencimiento;

    if (cantidad <= 0 || monto < 0 || !primerVencimiento) {
      alert(
        "Completa cantidad, monto y primer vencimiento para generar las cuotas.",
      );
      return;
    }

    const vencimientos: CursoConceptoVencimientoForm[] = Array.from(
      { length: cantidad },
      (_, idx) => ({
        nroOrden: idx + 1,
        monto,
        fechaVencimiento: primerVencimiento.add(idx, "month"),
        descripcion: `Cuota ${idx + 1}`,
        activo: true,
      }),
    );

    setValues((prev) => {
      const conceptos = [...prev.conceptos];
      const conceptoActual = conceptos[conceptoIndex];

      if (!conceptoActual) {
        return prev;
      }

      conceptos[conceptoIndex] = {
        ...conceptoActual,
        descripcion: conceptoActual.descripcion?.trim() || "Cuotas mensuales",
        vencimientos,
      };

      return { ...prev, conceptos };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!values.nombre.trim()) {
      alert("El nombre del curso es obligatorio.");
      return;
    }

    if (!values.fechaInicio || !values.fechaFin) {
      alert("Debes completar la fecha de inicio y fin del curso.");
      return;
    }

    if (values.conceptos.length === 0) {
      alert("Debes agregar al menos un concepto al curso.");
      return;
    }

    const conceptoInvalido = values.conceptos.some(
      (c) =>
        !c.tipoConcepto ||
        !c.descripcion.trim() ||
        c.vencimientos.length === 0 ||
        c.vencimientos.some(
          (v) => !v.fechaVencimiento || Number(v.monto || 0) < 0,
        ),
    );

    if (conceptoInvalido) {
      alert(
        "Revisa los conceptos y vencimientos. Todos deben tener datos válidos.",
      );
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(values);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar el curso.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          width: "100%",
          minWidth: 0,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {modo === "crear" ? "Agregar curso" : "Editar curso"}
        </Typography>

        <TextField
          label="Nombre"
          value={values.nombre}
          onChange={(e) => handleFieldChange("nombre", e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Descripción"
          value={values.descripcion}
          onChange={(e) => handleFieldChange("descripcion", e.target.value)}
          multiline
          rows={2}
          fullWidth
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Duración"
            type="number"
            value={values.duracion}
            onChange={(e) =>
              handleFieldChange(
                "duracion",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            required
            fullWidth
          />

          <TextField
            select
            label="Unidad"
            value={values.unidadDuracion}
            onChange={(e) =>
              handleFieldChange("unidadDuracion", e.target.value)
            }
            fullWidth
          >
            {unidades.map((op) => (
              <MenuItem key={op} value={op}>
                {op}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <DatePicker
              label="Fecha Inicio"
              value={values.fechaInicio}
              onChange={(date) =>
                handleDateChange(
                  "fechaInicio",
                  date && dayjs.isDayjs(date) ? date : null,
                )
              }
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                },
              }}
            />

            <DatePicker
              label="Fecha Fin"
              value={values.fechaFin}
              onChange={(date) =>
                handleDateChange(
                  "fechaFin",
                  date && dayjs.isDayjs(date) ? date : null,
                )
              }
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                },
              }}
            />
          </Box>
        </LocalizationProvider>

        <FormControlLabel
          label="¿Curso activo?"
          control={
            <Switch
              checked={values.activo}
              onChange={(e) => handleFieldChange("activo", e.target.checked)}
            />
          }
        />

        <Divider />

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Conceptos del curso
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {tiposConcepto.map((tipo) => (
            <Button
              key={tipo}
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => agregarConcepto(tipo)}
              disabled={tiposExistentes.includes(tipo)}
            >
              {tipo}
            </Button>
          ))}
        </Box>

        {values.conceptos.map((concepto, conceptoIndex) => {
          const autoConfig = autoCuotas[conceptoIndex] ?? {
            cantidad: "",
            monto: "",
            primerVencimiento: null,
          };

          return (
            <Paper
              key={`${concepto.tipoConcepto}-${conceptoIndex}`}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {concepto.tipoConcepto}
                </Typography>

                <IconButton
                  color="error"
                  onClick={() => eliminarConcepto(conceptoIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  select
                  label="Tipo de concepto"
                  value={concepto.tipoConcepto}
                  onChange={(e) =>
                    handleConceptoChange(
                      conceptoIndex,
                      "tipoConcepto",
                      e.target.value,
                    )
                  }
                  fullWidth
                  disabled
                >
                  {tiposConcepto.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Descripción del concepto"
                  value={concepto.descripcion}
                  onChange={(e) =>
                    handleConceptoChange(
                      conceptoIndex,
                      "descripcion",
                      e.target.value,
                    )
                  }
                  fullWidth
                />
              </Box>

              <FormControlLabel
                label="Concepto activo"
                control={
                  <Switch
                    checked={concepto.activo}
                    onChange={(e) =>
                      handleConceptoChange(
                        conceptoIndex,
                        "activo",
                        e.target.checked,
                      )
                    }
                  />
                }
              />

              <Divider sx={{ my: 2 }} />

              {concepto.tipoConcepto === "Cuota" ? (
                <>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    Generación automática de cuotas
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <TextField
                      label="Cantidad de cuotas"
                      type="number"
                      value={autoConfig.cantidad}
                      onChange={(e) =>
                        handleAutoCuotaChange(
                          conceptoIndex,
                          "cantidad",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      fullWidth
                    />

                    <TextField
                      label="Monto por cuota"
                      type="number"
                      value={autoConfig.monto}
                      onChange={(e) =>
                        handleAutoCuotaChange(
                          conceptoIndex,
                          "monto",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      fullWidth
                    />

                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="es"
                    >
                      <DatePicker
                        label="Primer vencimiento"
                        value={autoConfig.primerVencimiento}
                        onChange={(date) =>
                          handleAutoCuotaChange(
                            conceptoIndex,
                            "primerVencimiento",
                            date && dayjs.isDayjs(date) ? date : null,
                          )
                        }
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<AutoFixHighIcon />}
                    onClick={() => generarCuotas(conceptoIndex)}
                    sx={{ mb: 2 }}
                  >
                    Generar cuotas
                  </Button>
                </>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => agregarVencimientoManual(conceptoIndex)}
                  >
                    Agregar vencimiento
                  </Button>
                </Box>
              )}

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Vencimientos
              </Typography>

              {concepto.vencimientos.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Aún no hay vencimientos cargados.
                </Typography>
              )}

              {concepto.vencimientos.map((vencimiento, vencimientoIndex) => (
                <Paper
                  key={`${conceptoIndex}-${vencimientoIndex}`}
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>
                      Vencimiento #{vencimiento.nroOrden}
                    </Typography>

                    <IconButton
                      color="error"
                      onClick={() =>
                        eliminarVencimiento(conceptoIndex, vencimientoIndex)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <TextField
                      label="Nro. orden"
                      type="number"
                      value={vencimiento.nroOrden}
                      onChange={(e) =>
                        handleVencimientoChange(
                          conceptoIndex,
                          vencimientoIndex,
                          "nroOrden",
                          Number(e.target.value || 0),
                        )
                      }
                      fullWidth
                      disabled={concepto.tipoConcepto === "Cuota"}
                    />

                    <TextField
                      label="Monto"
                      type="number"
                      value={vencimiento.monto}
                      onChange={(e) =>
                        handleVencimientoChange(
                          conceptoIndex,
                          vencimientoIndex,
                          "monto",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      fullWidth
                    />
                  </Box>

                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="es"
                  >
                    <DatePicker
                      label="Fecha de vencimiento"
                      value={vencimiento.fechaVencimiento}
                      onChange={(date) =>
                        handleVencimientoChange(
                          conceptoIndex,
                          vencimientoIndex,
                          "fechaVencimiento",
                          date && dayjs.isDayjs(date) ? date : null,
                        )
                      }
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <TextField
                    label="Descripción"
                    value={vencimiento.descripcion}
                    onChange={(e) =>
                      handleVencimientoChange(
                        conceptoIndex,
                        vencimientoIndex,
                        "descripcion",
                        e.target.value,
                      )
                    }
                    fullWidth
                    sx={{ mt: 2 }}
                  />

                  <FormControlLabel
                    sx={{ mt: 1 }}
                    label="Vencimiento activo"
                    control={
                      <Switch
                        checked={vencimiento.activo}
                        onChange={(e) =>
                          handleVencimientoChange(
                            conceptoIndex,
                            vencimientoIndex,
                            "activo",
                            e.target.checked,
                          )
                        }
                      />
                    }
                  />
                </Paper>
              ))}
            </Paper>
          );
        })}

        <DialogActions
          sx={{
            mt: 2,
            px: 0,
            pb: 0,
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Button onClick={onCancel} color="secondary" disabled={submitting}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {modo === "crear" ? "Agregar" : "Guardar"}
          </Button>
        </DialogActions>
      </Box>
    </form>
  );
};
