// src/modulos/Permisos/pages/RolesPage.tsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useRoles } from "../hooks/useRoles";
import RolesForm from "../components/RolesForm";
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  roles?: number[]; // opcional si tu backend devuelve roles asignados
}

const RolesPage: React.FC = () => {
  const { usuarios, roles, loading, error, setSearch } = useRoles();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const handleRoleChange = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSaveRoles = () => {
    console.log("✅ Usuario:", selectedUser);
    console.log("🛡️ Roles asignados:", selectedRoles);
    // Aquí llamás al servicio correspondiente
  };

  const handleUserSelect = (user: Usuario) => {
    setSelectedUser(user.id);
    setSelectedRoles(user.roles || []);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Configuración de Roles
      </Typography>

      <TextField
        fullWidth
        label="Buscar Usuario..."
        variant="outlined"
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={4}>
        {/* Usuarios */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={1}>
            Usuarios
          </Typography>
          {usuarios.map((user: Usuario) => (
            <Card
              key={user.id}
              onClick={() => handleUserSelect(user)}
              sx={{
                mb: 1,
                backgroundColor: selectedUser === user.id ? "#E3F2FD" : "#fff",
                cursor: "pointer",
                border:
                  selectedUser === user.id
                    ? "2px solid #1976d2"
                    : "1px solid #ccc",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1">{user.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Roles Form */}
        <Grid item xs={12} md={6}>
          <RolesForm
            roles={roles}
            selectedRoles={selectedRoles}
            onChange={handleRoleChange}
            onSave={handleSaveRoles}
            disabled={!selectedUser}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RolesPage;
