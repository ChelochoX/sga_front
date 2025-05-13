import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { Persona } from "../types/personas.types";
import { useTheme } from "@mui/material/styles";

interface PersonaFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (persona: Persona) => void;
  initialData?: Persona;
}

const initialState: Persona = {
  id: 0,
  nombres: "",
  apellidos: "",
  email: "",
  telefono: "",
  direccion: "",
  fechaNacimiento: "",
  fechaRegistro: "",
  cedula: "",
  ruc: "",
  digitoVerificador: 0,
};

const PersonaForm: React.FC<PersonaFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [persona, setPersona] = useState<Persona>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Cada vez que se abre el form con datos, se setean en el estado
  useEffect(() => {
    if (initialData) {
      setPersona(initialData);
    } else {
      setPersona(initialState);
    }

    // 👇 Enfocamos el primer input al abrir el modal
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [initialData, open]);

  // ✅ Manejo de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersona((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiamos el error si se corrige el campo
    if (value !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Función para validar campos obligatorios
  const validateFields = () => {
    const requiredFields = [
      "nombres",
      "apellidos",
      "email",
      "telefono",
      "direccion",
      "fechaNacimiento",
      "cedula",
      "ruc",
    ];

    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!persona[field as keyof Persona]) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    setErrors(newErrors);

    // Si no hay errores, retorna `true`
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Guardar cambios al hacer submit
  const handleSave = () => {
    if (validateFields()) {
      onSave(persona);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: isMobile ? "18px" : "20px",
        }}
      >
        {persona.id ? "Editar Persona" : "Agregar Persona"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} alignItems="flex-start">
          {/* 🔄 Campos del formulario */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombres"
              name="nombres"
              fullWidth
              size="small"
              value={persona.nombres}
              onChange={handleChange}
              inputRef={inputRef}
              variant="outlined"
              error={Boolean(errors.nombres)}
              helperText={errors.nombres}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellidos"
              name="apellidos"
              fullWidth
              size="small"
              value={persona.apellidos}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.apellidos)}
              helperText={errors.apellidos}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Dirección"
              name="direccion"
              fullWidth
              size="small"
              value={persona.direccion}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.direccion)}
              helperText={errors.direccion}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              size="small"
              value={persona.email}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              name="telefono"
              fullWidth
              size="small"
              value={persona.telefono}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.telefono)}
              helperText={errors.telefono}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Nacimiento"
              name="fechaNacimiento"
              fullWidth
              size="small"
              value={persona.fechaNacimiento}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.fechaNacimiento)}
              helperText={errors.fechaNacimiento}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Cédula"
              name="cedula"
              fullWidth
              size="small"
              value={persona.cedula}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.cedula)}
              helperText={errors.cedula}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="RUC"
              name="ruc"
              fullWidth
              size="small"
              value={persona.ruc}
              onChange={handleChange}
              variant="outlined"
              error={Boolean(errors.ruc)}
              helperText={errors.ruc}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dígito Verificador"
              name="digitoVerificador"
              fullWidth
              size="small"
              value={persona.digitoVerificador}
              onChange={handleChange}
              type="number"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <Button onClick={onClose} color="secondary" variant="contained">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {persona.id ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonaForm;
