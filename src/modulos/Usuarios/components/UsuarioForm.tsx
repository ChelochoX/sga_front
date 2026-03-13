import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Usuario } from "../types/usuarios.types";

interface UsuarioFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (usuario: Partial<Usuario>) => Promise<void>;
  initialData?: Usuario;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
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
      setNombreUsuario(initialData?.nombreUsuario ?? "");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [initialData, open]);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!nombreUsuario.trim()) {
      newErrors.nombreUsuario = "Este campo es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!initialData) return;
    if (!validateFields()) return;

    try {
      setSaving(true);
      setFormError("");

      await onSave({
        idUsuario: initialData.idUsuario,
        nombreUsuario,
        fechaModificacion: new Date().toISOString(),
      });
    } catch (error: any) {
      setFormError(
        error?.message || "Ocurrió un problema al guardar el usuario.",
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
          width: isMobile ? "100%" : "700px",
          maxWidth: "700px",
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
        Editar Usuario
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
          <Grid item xs={12}>
            <TextField
              label="Nombre de Usuario"
              name="nombreUsuario"
              fullWidth
              size="small"
              value={nombreUsuario}
              onChange={(e) => {
                setNombreUsuario(e.target.value);

                if (errors.nombreUsuario) {
                  setErrors((prev) => ({ ...prev, nombreUsuario: "" }));
                }

                if (formError) {
                  setFormError("");
                }
              }}
              inputRef={inputRef}
              variant="outlined"
              error={Boolean(errors.nombreUsuario)}
              helperText={errors.nombreUsuario}
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          marginBottom: 2,
          backgroundColor: formBackgroundColor,
        }}
      >
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={saving}
          sx={{ minWidth: 120 }}
        >
          {saving ? "Guardando..." : "Guardar"}
        </Button>

        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          disabled={saving}
          sx={{ minWidth: 120 }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioForm;
