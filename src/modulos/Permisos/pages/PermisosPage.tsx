import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import PermisosForm from "../components/PermisosForm";
import { usePermisos } from "../hooks/usePermisos";

const PermisosPage: React.FC = () => {
  const [idRol, setIdRol] = useState<number>(1); // Valor por defecto
  const { entidades, recursos, permisos, loading, error } = usePermisos(idRol);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Gestión de Permisos
      </Typography>

      {/* 🔽 Selector de Rol */}
      <Select
        value={idRol}
        onChange={(e) => setIdRol(Number(e.target.value))}
        sx={{ mb: 2 }}
      >
        <MenuItem value={1}>Administrador</MenuItem>
        <MenuItem value={2}>Cajero</MenuItem>
        <MenuItem value={3}>CambioContraseña</MenuItem>
        <MenuItem value={4}>Docente</MenuItem>
        <MenuItem value={5}>Estudiante</MenuItem>
        <MenuItem value={6}>Superadministrador</MenuItem>
      </Select>

      {/* 🔽 Componente de Permisos */}
      <PermisosForm
        entidades={entidades}
        recursos={recursos}
        permisos={permisos}
      />
    </Box>
  );
};

export default PermisosPage;
