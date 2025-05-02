import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { login } from "../../api/authService";
import { LoginRequest } from "../../types/auth";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👉 Importante

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const credentials: LoginRequest = {
      Usuario: username,
      Contrasena: password,
    };

    try {
      const result = await login(credentials);
      if ("parTokens" in result) {
        console.log("Token:", result.parTokens.bearerToken);
        navigate("/dashboard/personas"); // 👈 Redirige al Dashboard
      } else if ("RequiereCambioContrasena" in result) {
        navigate("/cambiar-contrasena");
      }
    } catch (err: any) {
      setError(err.message);
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
          maxWidth: 360,
          padding: 4,
          borderRadius: 5,
          backgroundColor: "white",
          boxShadow: "0px 10px 40px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 600px)": {
            maxWidth: 320,
            padding: 3,
          },
        }}
      >
        <Typography variant="h5" textAlign="center" mb={4}>
          Iniciar sesión
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            variant="standard"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            variant="standard"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Typography color="error" variant="body2" mt={2}>
              {error}
            </Typography>
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
            Iniciar sesión
          </Button>
          <Typography variant="body2" mt={2} textAlign="center" width="100%">
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
    </Box>
  );
};

export default Login;
