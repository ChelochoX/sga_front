import React, { useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";

export interface CursoFormValues {
  nombre: string;
  descripcion: string;
  duracion: number | "";
  unidadDuracion: string;
  cantidadCuota: number | "";
  montoMatricula: number | "";
  montoCuota: number | "";
  tienePractica: boolean;
  costoPractica: number | "";
  fechaInicio: Dayjs | null;
  fechaFin: Dayjs | null;
  activo: boolean;
}

interface CursoFormProps {
  initialValues?: Partial<CursoFormValues>;
  onCancel: () => void;
  onSubmit: (data: CursoFormValues) => Promise<void> | void;
  onSuccess?: () => void;
  modo?: "crear" | "editar";
}

const unidades = ["Horas", "Dias", "Semanas", "Meses"];

const numberFields = new Set([
  "duracion",
  "cantidadCuota",
  "montoMatricula",
  "montoCuota",
  "costoPractica",
]);

export const CursoForm: React.FC<CursoFormProps> = ({
  initialValues,
  onCancel,
  onSubmit,
  onSuccess,
  modo = "crear",
}) => {
  const [values, setValues] = useState<CursoFormValues>({
    nombre: initialValues?.nombre ?? "",
    descripcion: initialValues?.descripcion ?? "",
    duracion: initialValues?.duracion ?? "",
    unidadDuracion: initialValues?.unidadDuracion ?? "Horas",
    cantidadCuota: initialValues?.cantidadCuota ?? "",
    montoMatricula: initialValues?.montoMatricula ?? "",
    montoCuota: initialValues?.montoCuota ?? "",
    tienePractica: initialValues?.tienePractica ?? false,
    costoPractica: initialValues?.costoPractica ?? "",
    fechaInicio: initialValues?.fechaInicio
      ? dayjs(initialValues.fechaInicio)
      : null,
    fechaFin: initialValues?.fechaFin ? dayjs(initialValues.fechaFin) : null,
    activo: initialValues?.activo ?? false,
  });

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
        cantidadCuota: values.cantidadCuota === "" ? 0 : values.cantidadCuota,
        montoMatricula:
          values.montoMatricula === "" ? 0 : values.montoMatricula,
        montoCuota: values.montoCuota === "" ? 0 : values.montoCuota,
        costoPractica: values.costoPractica === "" ? 0 : values.costoPractica,
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
            SelectProps={{ native: true }}
            value={values.unidadDuracion}
            onChange={handleChange}
            fullWidth
            sx={{ flex: 1 }}
          >
            {unidades.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </TextField>
        </Box>

        <TextField
          label="Cantidad de cuotas"
          name="cantidadCuota"
          type="number"
          value={values.cantidadCuota}
          onChange={handleChange}
          onFocus={handleFocusSelectIfZero}
          required
          fullWidth
        />

        <TextField
          label="Monto matrícula"
          name="montoMatricula"
          type="number"
          value={values.montoMatricula}
          onChange={handleChange}
          onFocus={handleFocusSelectIfZero}
          required
          fullWidth
        />

        <TextField
          label="Monto cuota"
          name="montoCuota"
          type="number"
          value={values.montoCuota}
          onChange={handleChange}
          onFocus={handleFocusSelectIfZero}
          required
          fullWidth
        />

        <FormControlLabel
          label="¿Tiene práctica?"
          control={
            <Switch
              name="tienePractica"
              checked={values.tienePractica}
              onChange={handleChange}
            />
          }
        />

        <TextField
          label="Costo práctica"
          name="costoPractica"
          type="number"
          value={values.costoPractica}
          onChange={handleChange}
          onFocus={handleFocusSelectIfZero}
          required={values.tienePractica}
          disabled={!values.tienePractica}
          fullWidth
        />

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
