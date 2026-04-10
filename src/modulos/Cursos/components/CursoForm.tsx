import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import {
  CursoConceptoForm,
  CursoConceptoVencimientoForm,
  CursoFormValues,
  TipoConcepto,
} from "../types/cursos.types";

interface CursoFormProps {
  initialValues?: Partial<CursoFormValues>;
  onCancel: () => void;
  onSubmit: (data: CursoFormValues) => Promise<void> | void;
  onSuccess?: () => void;
  modo?: "crear" | "editar";
}

const unidades = ["Horas", "Dias", "Semanas", "Meses"];
const tiposConcepto: TipoConcepto[] = [
  "Matricula",
  "Cuota",
  "Practica",
  "DerechoExamen",
];

const numberFields = new Set(["duracion", "monto"]);

const defaultVencimiento = (nroOrden = 1): CursoConceptoVencimientoForm => ({
  nroOrden,
  monto: "",
  fechaVencimiento: null,
  descripcion: "",
  activo: true,
});

const defaultConcepto = (tipo?: TipoConcepto): CursoConceptoForm => ({
  tipoConcepto: tipo ?? "Cuota",
  descripcion: "",
  activo: true,
  vencimientos: [defaultVencimiento(1)],
});

const mapInitialConceptos = (
  conceptos?: CursoConceptoForm[],
): CursoConceptoForm[] => {
  if (!conceptos || conceptos.length === 0) return [defaultConcepto("Cuota")];

  return conceptos.map((c) => ({
    tipoConcepto: c.tipoConcepto,
    descripcion: c.descripcion ?? "",
    activo: c.activo ?? true,
    vencimientos:
      c.vencimientos?.length > 0
        ? c.vencimientos.map((v, idx) => ({
            nroOrden: v.nroOrden ?? idx + 1,
            monto: v.monto ?? "",
            fechaVencimiento: v.fechaVencimiento
              ? dayjs(v.fechaVencimiento)
              : null,
            descripcion: v.descripcion ?? "",
            activo: v.activo ?? true,
          }))
        : [defaultVencimiento(1)],
  }));
};

export const CursoForm: React.FC<CursoFormProps> = ({
  initialValues,
  onCancel,
  onSubmit,
  onSuccess,
  modo = "crear",
}) => {
  const initialState: CursoFormValues = useMemo(
    () => ({
      nombre: initialValues?.nombre ?? "",
      descripcion: initialValues?.descripcion ?? "",
      duracion: initialValues?.duracion ?? "",
      unidadDuracion: initialValues?.unidadDuracion ?? "Horas",
      fechaInicio: initialValues?.fechaInicio
        ? dayjs(initialValues.fechaInicio)
        : null,
      fechaFin: initialValues?.fechaFin ? dayjs(initialValues.fechaFin) : null,
      activo: initialValues?.activo ?? false,
      conceptos: mapInitialConceptos(initialValues?.conceptos),
    }),
    [initialValues],
  );

  const [values, setValues] = useState<CursoFormValues>(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setValues((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    if (numberFields.has(name)) {
      setValues((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (
    name: "fechaInicio" | "fechaFin",
    date: Dayjs | null,
  ) => {
    setValues((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleConceptoChange = (
    index: number,
    field: keyof Omit<CursoConceptoForm, "vencimientos">,
    value: string | boolean,
  ) => {
    setValues((prev) => {
      const conceptos = [...prev.conceptos];
      const conceptoActual = conceptos[index];
      if (!conceptoActual) return prev;

      conceptos[index] = {
        ...conceptoActual,
        [field]: value,
      } as CursoConceptoForm;

      return { ...prev, conceptos };
    });
  };

  const handleVencimientoChange = (
    conceptoIndex: number,
    vencimientoIndex: number,
    field: keyof CursoConceptoVencimientoForm,
    value: string | number | boolean | Dayjs | null | "",
  ) => {
    setValues((prev) => {
      const conceptos = [...prev.conceptos];
      const conceptoActual = conceptos[conceptoIndex];
      if (!conceptoActual) return prev;

      const vencimientos = [...conceptoActual.vencimientos];
      const vencimientoActual = vencimientos[vencimientoIndex];
      if (!vencimientoActual) return prev;

      vencimientos[vencimientoIndex] = {
        ...vencimientoActual,
        [field]: value,
      } as CursoConceptoVencimientoForm;

      conceptos[conceptoIndex] = {
        ...conceptoActual,
        vencimientos,
      };

      return { ...prev, conceptos };
    });
  };

  const agregarConcepto = (tipo?: TipoConcepto) => {
    setValues((prev) => ({
      ...prev,
      conceptos: [...prev.conceptos, defaultConcepto(tipo)],
    }));
  };

  const eliminarConcepto = (index: number) => {
    setValues((prev) => ({
      ...prev,
      conceptos: prev.conceptos.filter((_, i) => i !== index),
    }));
  };

  const agregarVencimiento = (conceptoIndex: number) => {
    setValues((prev) => {
      const conceptos = [...prev.conceptos];
      const conceptoActual = conceptos[conceptoIndex];
      if (!conceptoActual) return prev;

      const nroOrden = conceptoActual.vencimientos.length + 1;

      conceptos[conceptoIndex] = {
        ...conceptoActual,
        vencimientos: [
          ...conceptoActual.vencimientos,
          defaultVencimiento(nroOrden),
        ],
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
      const conceptoActual = conceptos[conceptoIndex];
      if (!conceptoActual) return prev;

      const nuevosVencimientos = conceptoActual.vencimientos
        .filter((_, i) => i !== vencimientoIndex)
        .map((v, idx) => ({
          ...v,
          nroOrden: idx + 1,
        }));

      conceptos[conceptoIndex] = {
        ...conceptoActual,
        vencimientos:
          nuevosVencimientos.length > 0
            ? nuevosVencimientos
            : [defaultVencimiento(1)],
      };

      return { ...prev, conceptos };
    });
  };

  const handleFocusSelectIfZero = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (numberFields.has(name) && (value === "0" || value === "0.00")) {
      e.target.select();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        ...values,
        duracion: values.duracion === "" ? 0 : values.duracion,
        conceptos: values.conceptos.map((c) => ({
          ...c,
          vencimientos: c.vencimientos.map((v, idx) => ({
            ...v,
            nroOrden: idx + 1,
            monto: v.monto === "" ? 0 : v.monto,
          })),
        })),
      });

      if (onSuccess) onSuccess();
      onCancel();
    } catch (error) {
      alert("Error al guardar el curso");
      console.error(error);
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
          gap: 2,
          width: "100%",
          minWidth: 0,
        }}
      >
        <TextField
          label="Nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Descripción"
          name="descripcion"
          value={values.descripcion}
          onChange={handleChange}
          multiline
          rows={2}
          fullWidth
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            label="Duración"
            name="duracion"
            type="number"
            value={values.duracion}
            onChange={handleChange}
            onFocus={handleFocusSelectIfZero}
            required
            fullWidth
            sx={{ flex: 1 }}
          />

          <TextField
            select
            label="Unidad"
            name="unidadDuracion"
            value={values.unidadDuracion}
            onChange={handleChange}
            fullWidth
            sx={{ flex: 1 }}
          >
            {unidades.map((op) => (
              <MenuItem key={op} value={op}>
                {op}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
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
        </LocalizationProvider>

        <FormControlLabel
          label="¿Curso activo?"
          control={
            <Switch
              name="activo"
              checked={values.activo}
              onChange={handleChange}
              color="primary"
            />
          }
        />

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Conceptos del curso
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {tiposConcepto.map((tipo) => (
              <Button
                key={tipo}
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => agregarConcepto(tipo)}
              >
                {tipo}
              </Button>
            ))}
          </Box>
        </Box>

        {values.conceptos.map((concepto, conceptoIndex) => (
          <Paper
            key={`${concepto.tipoConcepto}-${conceptoIndex}`}
            variant="outlined"
            sx={{ p: 2, borderRadius: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                gap: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Concepto {conceptoIndex + 1}
              </Typography>

              <IconButton
                color="error"
                onClick={() => eliminarConcepto(conceptoIndex)}
                disabled={values.conceptos.length === 1}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
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
                    e.target.value as TipoConcepto,
                  )
                }
                fullWidth
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Vencimientos
              </Typography>

              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => agregarVencimiento(conceptoIndex)}
              >
                Agregar vencimiento
              </Button>
            </Box>

            {concepto.vencimientos.map((vencimiento, vencimientoIndex) => (
              <Paper
                key={`${conceptoIndex}-${vencimientoIndex}`}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    gap: 1,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Vencimiento #{vencimiento.nroOrden}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() =>
                      eliminarVencimiento(conceptoIndex, vencimientoIndex)
                    }
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Nro. orden"
                    type="number"
                    value={vencimiento.nroOrden}
                    disabled
                    fullWidth
                  />

                  <TextField
                    label="Monto"
                    name="monto"
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
                    onFocus={handleFocusSelectIfZero}
                    required
                    fullWidth
                  />

                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="es"
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
                  />
                </Box>

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
        ))}
      </Box>

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
    </form>
  );
};
