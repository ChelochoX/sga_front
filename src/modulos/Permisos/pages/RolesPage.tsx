import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
  Button,
} from "@mui/material";
import { ExpandMore, Search } from "@mui/icons-material";

import { useRoles } from "../hooks/useRoles";

const RolesPage: React.FC = () => {
  const {
    rolesDetalle,
    rolesCatalogo,
    selectedRoles,
    setSelectedRoles,
    loading,
    setFilter,
  } = useRoles();

  const [searchText, setSearchText] = useState("");

  const handleRoleToggle = (idRol: number) => {
    setSelectedRoles((prev) =>
      prev.includes(idRol)
        ? prev.filter((id) => id !== idRol)
        : [...prev, idRol]
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Gestión de Roles
      </Typography>

      {/* 🔍 Buscador */}
      <Paper
        sx={{
          mb: 2,
          borderRadius: 50,
          px: 2,
          py: 1,
          boxShadow: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <InputAdornment position="start">
          <IconButton>
            <Search />
          </IconButton>
        </InputAdornment>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setFilter(e.target.value);
          }}
          style={{
            border: "none",
            outline: "none",
            padding: "12px",
            fontSize: "16px",
            width: "100%",
            borderRadius: "50px",
            backgroundColor: "transparent",
          }}
        />
      </Paper>

      {/* ✅ Selector de roles */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Asignar roles al usuario
        </Typography>

        <Grid container spacing={2}>
          {rolesCatalogo.map((rol) => (
            <Grid item xs={12} sm={6} md={4} key={rol.idRol}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRoles.includes(rol.idRol)} // 🔁 Estado sincronizado
                    onChange={() => {
                      if (selectedRoles.includes(rol.idRol)) {
                        // 🔄 Deseleccionamos
                        setSelectedRoles((prev) =>
                          prev.filter((id) => id !== rol.idRol)
                        );
                      } else {
                        // ✅ Seleccionamos
                        setSelectedRoles((prev) => [...prev, rol.idRol]);
                      }
                    }}
                    sx={{
                      color: "purple",
                      "&.Mui-checked": {
                        color: "purple",
                      },
                    }}
                  />
                }
                label={rol.nombreRol}
              />
            </Grid>
          ))}
        </Grid>

        <Box textAlign="right" mt={2}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(to right, #5b0eb1, #1f64e6)",
              },
            }}
            onClick={() => {
              console.log("💾 Guardar roles seleccionados:", selectedRoles);
              // Aquí iría la llamada a la API para guardar
            }}
          >
            Guardar
          </Button>
        </Box>
      </Paper>

      {/* 📂 Detalle de roles */}
      {loading ? (
        <CircularProgress />
      ) : rolesDetalle.length > 0 && !rolesDetalle[0]?.nombreRol ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "#fdf2f8",
            color: "#b00060",
            border: "1px dashed #e91e63",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            ❕ Este usuario no posee ningún rol asignado actualmente.
          </Typography>
        </Paper>
      ) : (
        rolesDetalle.map((rol) => (
          <Paper
            key={rol.idRol}
            elevation={2}
            sx={{
              mb: 2,
              borderRadius: 2,
              backgroundColor: "#f8f9fc",
              p: 2,
            }}
          >
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight="bold" color="primary">
                  Rol: {rol.nombreRol}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography fontWeight="bold" mb={1}>
                  Permisos habilitados
                </Typography>

                {rol.entidades.length === 0 ? (
                  <Typography color="text.secondary" fontStyle="italic">
                    — No tiene entidades/recursos —
                  </Typography>
                ) : (
                  rol.entidades.map((ent) => (
                    <Box key={ent.idEntidad} mb={2}>
                      <Typography sx={{ mb: 1 }}>
                        Entidad:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {ent.nombreEntidad}
                        </span>
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {ent.acciones.map((accion, i) => (
                          <Chip
                            key={i}
                            label={accion}
                            size="small"
                            sx={{
                              backgroundColor: "#e3e8ff",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))
                )}
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default RolesPage;
