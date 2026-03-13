import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  useMediaQuery,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Persona } from "../types/personas.types";
import { useTheme } from "@mui/material/styles";
import { formatDateToYYYYMMDD } from "../../../utils/dateUtils";

interface PersonaFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (persona: Persona) => Promise<void>;
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
  ruc: "N",
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
  const [formError, setFormError] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inputRef = useRef<HTMLInputElement | null>(null);

  const formBackgroundColor = "#f5f5f5";

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
    },
    "& .MuiInputLabel-root": {
      zIndex: 1,
      backgroundColor: formBackgroundColor,
      px: 0.75,
      lineHeight: 1.2,
    },
    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      zIndex: 1,
      backgroundColor: formBackgroundColor,
      px: 0.75,
      transform: "translate(14px, -9px) scale(0.75)",
    },
  };

  useEffect(() => {
    if (open) {
      setErrors({});
      setFormError("");

      if (initialData) {
        setPersona({
          ...initialData,
          fechaNacimiento:
            formatDateToYYYYMMDD(initialData.fechaNacimiento) ?? "",
          fechaRegistro: formatDateToYYYYMMDD(initialData.fechaRegistro) ?? "",
          ruc: initialData.ruc || "N",
          digitoVerificador:
            initialData.ruc === "S"
              ? Number(initialData.digitoVerificador ?? 0)
              : 0,
        });
      } else {
        setPersona(initialState);
      }

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setPersona((prev) => {
      if (name === "ruc") {
        const hasRuc = value === "S";

        return {
          ...prev,
          ruc: value,
          digitoVerificador: hasRuc ? prev.digitoVerificador : 0,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "ruc" && value === "N" && errors.digitoVerificador) {
      setErrors((prev) => ({ ...prev, digitoVerificador: "" }));
    }

    if (formError) {
      setFormError("");
    }
  };

  const handleSelectChange = (value: number) => {
    setPersona((prev) => ({
      ...prev,
      digitoVerificador: value,
    }));

    if (errors.digitoVerificador) {
      setErrors((prev) => ({ ...prev, digitoVerificador: "" }));
    }

    if (formError) {
      setFormError("");
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!persona.nombres?.trim()) {
      newErrors.nombres = "Este campo es obligatorio";
    }

    if (!persona.apellidos?.trim()) {
      newErrors.apellidos = "Este campo es obligatorio";
    }

    if (!persona.email?.trim()) {
      newErrors.email = "Este campo es obligatorio";
    }

    if (!persona.telefono?.trim()) {
      newErrors.telefono = "Este campo es obligatorio";
    }

    if (!persona.direccion?.trim()) {
      newErrors.direccion = "Este campo es obligatorio";
    }

    if (!persona.fechaNacimiento?.trim()) {
      newErrors.fechaNacimiento = "Este campo es obligatorio";
    }

    if (!persona.cedula?.trim()) {
      newErrors.cedula = "Este campo es obligatorio";
    }

    if (!persona.ruc?.trim()) {
      newErrors.ruc = "Este campo es obligatorio";
    }

    if (persona.ruc === "S") {
      const dv = Number(persona.digitoVerificador);
      if (Number.isNaN(dv) || dv < 0 || dv > 9) {
        newErrors.digitoVerificador =
          "Debe seleccionar un dígito verificador entre 0 y 9";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setSaving(true);
      setFormError("");

      await onSave(persona);
    } catch (error: any) {
      if (error?.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setErrors((prev) => ({
          ...prev,
          ...error.fieldErrors,
        }));
      }

      setFormError(
        error?.message || "Ocurrió un problema al guardar la persona.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "900px",
          maxWidth: "900px",
          borderRadius: isMobile ? 0 : 3,
          backgroundColor: formBackgroundColor,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: isMobile ? "18px" : "22px",
          backgroundColor: formBackgroundColor,
        }}
      >
        {persona.id ? "Editar Persona" : "Agregar Persona"}
      </DialogTitle>

      <DialogContent
        sx={{
          px: isMobile ? 2 : 4,
          pb: 2,
          backgroundColor: formBackgroundColor,
          overflow: "visible",
        }}
      >
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <Grid container spacing={2} alignItems="flex-start" sx={{ mt: 0.5 }}>
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
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
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
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
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
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
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
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
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
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha de Nacimiento"
              name="fechaNacimiento"
              type="date"
              fullWidth
              size="small"
              value={persona.fechaNacimiento || ""}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors.fechaNacimiento)}
              helperText={errors.fechaNacimiento}
              sx={textFieldSx}
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
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl error={Boolean(errors.ruc)} fullWidth>
              <FormLabel
                sx={{
                  color: "#6a11cb",
                  fontSize: "0.9rem",
                  mb: 1,
                }}
              >
                ¿Tiene RUC?
              </FormLabel>

              <RadioGroup
                row
                name="ruc"
                value={persona.ruc}
                onChange={handleChange}
              >
                <FormControlLabel value="S" control={<Radio />} label="Sí" />
                <FormControlLabel value="N" control={<Radio />} label="No" />
              </RadioGroup>

              {errors.ruc && <FormHelperText>{errors.ruc}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              size="small"
              error={Boolean(errors.digitoVerificador)}
              disabled={persona.ruc !== "S"}
              sx={textFieldSx}
            >
              <InputLabel shrink id="digito-verificador-label">
                Dígito Verificador
              </InputLabel>

              <Select
                labelId="digito-verificador-label"
                value={String(persona.digitoVerificador ?? 0)}
                label="Dígito Verificador"
                onChange={(e) => handleSelectChange(Number(e.target.value))}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((numero) => (
                  <MenuItem key={numero} value={String(numero)}>
                    {numero}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>
                {persona.ruc === "S"
                  ? errors.digitoVerificador ||
                    "Seleccione un dígito del 0 al 9"
                  : "Disponible solo si tiene RUC"}
              </FormHelperText>
            </FormControl>
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
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={saving}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {saving ? "Guardando..." : persona.id ? "Actualizar" : "Guardar"}
        </Button>

        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          disabled={saving}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonaForm;
