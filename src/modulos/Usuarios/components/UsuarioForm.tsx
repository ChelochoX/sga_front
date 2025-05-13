import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { Usuario } from "../types/usuarios.types";
import { useTheme } from "@mui/material/styles";

interface UsuarioFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (usuario: Usuario) => void;
  initialData?: Usuario; // Si tenemos datos iniciales para editar
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [usuario, setUsuario] = useState<Usuario>({
    idUsuario: 0,
    idPersona: 0,
    idRol: 0,
    nombreUsuario: "",
    contrasenaHash: "",
    estado: "activo",
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: new Date().toISOString(),
    contrasenaTemporal: "",
    requiereCambioContrasena: false,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (initialData) {
      setUsuario(initialData); // Si estamos editando, seteamos los datos
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(usuario); // Llamamos a la función `onSave` con los datos del usuario
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
        {usuario.idUsuario ? "Editar Usuario" : "Agregar Usuario"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre de Usuario"
              name="nombreUsuario"
              fullWidth
              value={usuario.nombreUsuario}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contraseña"
              name="contrasenaHash"
              type="password"
              fullWidth
              value={usuario.contrasenaHash}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Estado"
              name="estado"
              fullWidth
              value={usuario.estado}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {usuario.idUsuario ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioForm;
