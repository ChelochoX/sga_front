import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { Persona } from "../types/personas.types";

interface PersonaFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (persona: Persona) => void;
  initialData?: Persona;
}

const PersonaForm: React.FC<PersonaFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [persona, setPersona] = useState<Persona>({
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
  });

  useEffect(() => {
    if (initialData) {
      setPersona(initialData);
    } else {
      setPersona({
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
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPersona((prev) => ({
      ...prev,
      [name]: name === "digitoVerificador" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersona((prev) => ({
      ...prev,
      ruc: e.target.value,
    }));
  };

  const handleSubmit = () => {
    const formattedPersona = {
      ...persona,
      fechaNacimiento: new Date(persona.fechaNacimiento).toISOString(),
    };

    console.log("📝 Datos a guardar:", formattedPersona);
    onSave(formattedPersona);
    onClose();
    setPersona({
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
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Editar Persona" : "Nueva Persona"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombres"
                name="nombres"
                value={persona.nombres}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellidos"
                name="apellidos"
                value={persona.apellidos}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* 🔄 Dirección antes que Email y con un tamaño más grande */}
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                name="direccion"
                value={persona.direccion}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={persona.email}
                onChange={handleChange}
                fullWidth
                type="email"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                name="telefono"
                value={persona.telefono}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                value={persona.fechaNacimiento}
                onChange={handleChange}
                fullWidth
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Cédula"
                name="cedula"
                value={persona.cedula}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel component="legend">RUC</FormLabel>
              <RadioGroup
                row
                name="ruc"
                value={persona.ruc}
                onChange={handleRucChange}
              >
                <FormControlLabel
                  value="N"
                  control={<Radio color="primary" />}
                  label="N"
                />
                <FormControlLabel
                  value="S"
                  control={<Radio color="primary" />}
                  label="S"
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Dígito Verificador"
                name="digitoVerificador"
                value={persona.digitoVerificador}
                onChange={handleChange}
                fullWidth
                type="number"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonaForm;
