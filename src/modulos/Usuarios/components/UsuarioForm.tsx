import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { Usuario } from "../types/usuarios.types";

interface UsuarioFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (usuario: Partial<Usuario>) => void;
  initialData?: Usuario;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [nombreUsuario, setNombreUsuario] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setNombreUsuario(initialData.nombreUsuario);
    }
  }, [initialData]);

  const handleSave = () => {
    if (initialData) {
      onSave({
        idUsuario: initialData.idUsuario,
        nombreUsuario,
        fechaModificacion: new Date().toISOString(),
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre de Usuario"
              fullWidth
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioForm;
