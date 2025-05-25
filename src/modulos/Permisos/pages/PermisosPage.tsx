import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
} from "@mui/material";
import { ExpandMore, Search } from "@mui/icons-material";
import { useRoles } from "../hooks/useRoles";

const PermisosPage: React.FC = () => {
  const { rolesDetalle, loading, setFilter } = useRoles();
  const [searchText, setSearchText] = useState("");

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Gestión de Permisos
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

      {/* 👤 Nombre del usuario */}
      {rolesDetalle.length > 0 && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          <strong>Usuario seleccionado:</strong>{" "}
          {rolesDetalle[0]?.nombreUsuario ?? "-"}
        </Typography>
      )}

      {/* 📂 Detalle de permisos por rol */}
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

export default PermisosPage;
