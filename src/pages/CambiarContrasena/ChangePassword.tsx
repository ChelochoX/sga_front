import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import axios from "../api/axiosInstance";

const ChangePassword: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.post("/Auth/cambiar-contrasena", {
        Usuario: usuario,
        NuevaContrasena: nuevaContrasena,
        ConfirmarContrasena: confirmarContrasena,
      });
      setMensaje(response.data);
    } catch (err: any) {
      setError(err.response?.data || "Error al cambiar la contraseña.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #1d2b64, #f8cdda)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        paddingX: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 360,
          width: "100%",
          padding: 4,
          borderRadius: 5,
          backgroundColor: "white",
          boxShadow: "0px 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h5" textAlign="center" mb={4}>
          Cambiar Contraseña
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            variant="standard"
            fullWidth
            margin="normal"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <TextField
            label="Nueva Contraseña"
            variant="standard"
            type="password"
            fullWidth
            margin="normal"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            required
          />
          <TextField
            label="Confirmar Contraseña"
            variant="standard"
            type="password"
            fullWidth
            margin="normal"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {mensaje && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {mensaje}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              py: 1.5,
              borderRadius: "30px",
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(135deg, #2575fc, #6a11cb)",
              },
            }}
          >
            Cambiar Contraseña
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePassword;
