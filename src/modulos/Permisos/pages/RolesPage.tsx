import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Button,
} from "@mui/material";
import { useRoles } from "../hooks/useRoles";

const RolesPage: React.FC = () => {
  const { usuarios, roles, loading, error, setSearch } = useRoles();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const handleRoleChange = (roleId: number) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
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

      <Grid container spacing={2}>
        {/* 🔽 Usuarios */}
        <Grid item xs={6}>
          <Typography variant="h6">Usuarios</Typography>
          {usuarios.map((user: any) => (
            <Card
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              sx={{
                mb: 1,
                backgroundColor: selectedUser === user.id ? "#E3F2FD" : "white",
                cursor: "pointer",
              }}
            >
              <CardContent>
                {user.nombre} - {user.email}
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* 🔽 Roles */}
        <Grid item xs={6}>
          <Typography variant="h6">Roles Disponibles</Typography>
          {roles.map((rol: any) => (
            <Card key={rol.idRol} sx={{ mb: 1 }}>
              <CardContent>
                <Checkbox
                  checked={selectedRoles.includes(rol.idRol)}
                  onChange={() => handleRoleChange(rol.idRol)}
                />
                {rol.nombreRol}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        disabled={!selectedUser}
      >
        Guardar Configuración
      </Button>
    </Box>
  );
};

export default RolesPage;
