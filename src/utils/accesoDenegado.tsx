// src/utils/accesoDenegado.tsx
import React from "react";
import { Button, Typography, Box } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";

const AccesoDenegado: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#fafafa"
      textAlign="center"
      px={2}
    >
      <BlockIcon sx={{ fontSize: 80, color: "red", mb: 2 }} />
      <Typography variant="h4" color="error" gutterBottom>
        Acceso denegado
      </Typography>
      <Typography variant="subtitle1" sx={{ maxWidth: 500 }}>
        No tenés permisos para acceder al sistema. Por favor, contactá al
        administrador si creés que esto es un error.
      </Typography>

      <Box mt={6}>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "8px",
            fontSize: "1rem",
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(to right, #5f10b8, #1f63da)",
            },
          }}
        >
          Ir al inicio
        </Button>
      </Box>
    </Box>
  );
};

export default AccesoDenegado;
