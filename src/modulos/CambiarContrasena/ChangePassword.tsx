import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { changePassword } from "../../api/authService";

const ChangePassword: React.FC = () => {
  const [usuario, setUsuario] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const navigate = useNavigate();

  // 🔍 Monitorizamos el estado de conexión a Internet
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMensaje("");
    setOpenSnackbar(false);

    if (isOffline) {
      setError("¡Parece que no tienes conexión a Internet! 🌐❌");
      setOpenSnackbar(true);
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden. 🤔");
      setOpenSnackbar(true);
      return;
    }

    try {
      await changePassword({
        Usuario: usuario,
        NuevaContrasena: nuevaContrasena,
        ConfirmarContrasena: confirmarContrasena,
      });
      setMensaje("Contraseña cambiada exitosamente. Serás redirigido... 🚀");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/"), 4000);
    } catch (err: any) {
      if (!err.response) {
        setError("El servidor no está respondiendo, intenta más tarde... 💔");
      } else {
        setError(err.response.data?.message || "Error desconocido.");
      }
      setOpenSnackbar(true);
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
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 4,
          borderRadius: "20px",
          backgroundColor: "white",
          boxShadow: "0px 15px 30px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.5s ease-in-out",
          "@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      >
        <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold">
          Cambiar Contraseña
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            margin="normal"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
          <TextField
            label="Nueva Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
          <TextField
            label="Confirmar Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: "30px",
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              textTransform: "none",
              fontWeight: "bold",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          >
            Cambiar Contraseña
          </Button>

          <Typography variant="body2" mt={2} textAlign="center">
            <Link
              to="/"
              style={{
                color: "#6a11cb",
                textDecoration: "none",
                fontWeight: 500,
                display: "block",
                marginTop: "10px",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2575fc")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6a11cb")}
            >
              ⬅️ Volver al inicio de sesión
            </Link>
          </Typography>
        </form>
      </Paper>

      {isOffline && (
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            bottom: 20,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          🌐 Sin conexión. Verifica tu red y vuelve a intentarlo.
        </Typography>
      )}
      {/* Aquí agregamos el Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={null} // Deshabilita el cierre automático
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Arriba al centro
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error || mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePassword;
