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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { createCurso } from "../../../api/cursosService";

// 🔥 AGREGA el campo 'activo'
export interface CursoFormValues {
  nombre: string;
  descripcion: string;
  duracion: number;
  unidadDuracion: string;
  cantidadCuota: number;
  montoMatricula: number;
  montoCuota: number;
  tienePractica: boolean;
  costoPractica: number;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  activo: boolean; // <--- agregado
}

interface CursoFormProps {
  initialValues?: Partial<CursoFormValues>;
  onCancel: () => void;
  onSubmit: (data: CursoFormValues) => Promise<void> | void;
  onSuccess?: () => void;
  modo?: "crear" | "editar";
}

const unidades = ["Horas", "Dias", "Semanas", "Meses"];

export const CursoForm: React.FC<CursoFormProps> = ({
  initialValues,
  onCancel,
  onSubmit,
  onSuccess,
  modo = "crear",
}) => {
  const [values, setValues] = useState<CursoFormValues>({
    nombre: "",
    descripcion: "",
    duracion: 0,
    unidadDuracion: "Horas",
    cantidadCuota: 1,
    montoMatricula: 0,
    montoCuota: 0,
    tienePractica: false,
    costoPractica: 0,
    fechaInicio: null,
    fechaFin: null,
    activo: true, // <--- por defecto TRUE
    ...initialValues,
  });
  const [submitting, setSubmitting] = useState(false);

  // Handler para todos los TextField y Switch
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setValues((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      setValues((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handler para fechas
  const handleDateChange = (
    name: "fechaInicio" | "fechaFin",
    date: Date | null
  ) => {
    setValues((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  // Enviar (CREAR CURSO)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values); // <-- Solo pasa los valores "puros"
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
        sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 320 }}
      >
        <TextField
          label="Nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={values.descripcion}
          onChange={handleChange}
          multiline
          rows={2}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Duración"
            name="duracion"
            type="number"
            value={values.duracion}
            onChange={handleChange}
            required
            sx={{ flex: 1 }}
          />
          <TextField
            select
            label="Unidad"
            name="unidadDuracion"
            SelectProps={{ native: true }}
            value={values.unidadDuracion}
            onChange={handleChange}
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
          required
        />
        <TextField
          label="Monto matrícula"
          name="montoMatricula"
          type="number"
          value={values.montoMatricula}
          onChange={handleChange}
          required
        />
        <TextField
          label="Monto cuota"
          name="montoCuota"
          type="number"
          value={values.montoCuota}
          onChange={handleChange}
          required
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
          required={values.tienePractica}
          disabled={!values.tienePractica}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha Inicio"
            value={values.fechaInicio}
            onChange={(date) => handleDateChange("fechaInicio", date)}
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
            onChange={(date) => handleDateChange("fechaFin", date)}
            slotProps={{
              textField: {
                required: true,
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>
        {/* ---- AGREGADO: SWITCH DE ACTIVO ---- */}
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
        {/* ---- FIN AGREGADO ---- */}
      </Box>
      <DialogActions sx={{ mt: 2 }}>
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
