import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { login } from "../../api/authService";
import {
  LoginRequest,
  LoginSuccessResponse,
  CambioContrasenaResponse,
} from "../../types/auth";
type LoginResponse = LoginSuccessResponse | CambioContrasenaResponse;

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const navigate = useNavigate();

  // Limpieza de inputs al cargar el componente
  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  // Monitorizamos el estado de conexión a Internet
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

  // Oculta el snackbar cuando el usuario cambia los inputs
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOpenSnackbar(false);
      setter(e.target.value);
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setOpenSnackbar(false);

    if (isOffline) {
      setError(
        "🌐 Parece que no tienes conexión a Internet. Por favor, verifica y vuelve a intentar."
      );
      setOpenSnackbar(true);
      return;
    }

    const credentials: LoginRequest = {
      Usuario: username,
      Contrasena: password,
    };

    try {
      const result = await login(credentials);

      if (result.parTokens) {
        // Usuario activo, redirigir a dashboard
        navigate("/dashboard/personas");
      } else if (result.requiereCambioContrasena) {
        // Usuario necesita cambiar contraseña, redirigir a cambio
        navigate("/cambiar-contrasena", {
          state: { usuario: result.nombreUsuario },
        });
      } else {
        // Otro caso que no esperas
        setError("Estado de usuario no reconocido.");
        setOpenSnackbar(true);
      }
    } catch (err: any) {
      let mensaje = "❌ Ocurrió un error inesperado.";

      if (!err.response) {
        mensaje = "💔 El servidor no está respondiendo. Intenta más tarde.";
      } else if (err.response.status === 400) {
        mensaje = err.response.data?.message
          ? `🔒 Ups! ${err.response.data.message} Por favor verifica y vuelve a intentarlo.`
          : "🔒 Credenciales incorrectas. Por favor verifica y vuelve a intentarlo.";
      } else if (err.response.data?.message) {
        mensaje = `⚠️ ${err.response.data.message} Por favor intenta nuevamente.`;
      }

      setError(mensaje);
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
          Iniciar sesión
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={handleInputChange(setUsername)}
            required
            InputLabelProps={{
              shrink: Boolean(username), // Si hay valor, se mantiene arriba
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={handleInputChange(setPassword)}
            required
            InputLabelProps={{
              shrink: Boolean(password),
            }}
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
            Iniciar sesión
          </Button>

          <Typography variant="body2" mt={2} textAlign="center">
            <Link
              to="/cambiar-contrasena"
              style={{
                color: "#6a11cb",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              ¿Olvidaste tu contraseña?
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

      {/* Snackbar con mensaje persistente hasta cierre manual */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={null} // No desaparece solo
        onClose={() => setOpenSnackbar(false)} // El usuario lo cierra manualmente
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error.includes("🔒") ? "warning" : "error"}
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
