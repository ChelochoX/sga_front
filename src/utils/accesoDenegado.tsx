// src/pages/AccesoDenegado.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

const AccesoDenegado: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mensaje = searchParams.get("mensaje") || "No tenés permisos...";

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" color="error" gutterBottom>
        🚫 Acceso denegado
      </Typography>
      <Typography variant="body1" gutterBottom>
        {mensaje}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Ir al inicio
      </Button>
    </Box>
  );
};

export default AccesoDenegado;
