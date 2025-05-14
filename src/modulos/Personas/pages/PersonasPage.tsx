import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { usePersonas } from "../hooks/usePersonas";
import PersonaForm from "../components/PersonaForm";
import { Persona } from "../types/personas.types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { createPersona, updatePersona } from "../../../api/personasService";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";

const PersonasPage: React.FC = () => {
  const {
    personas,
    loading,
    editPersona,
    removePersona,
    fetchPersonas,
    setFilter,
  } = usePersonas();
  const [openForm, setOpenForm] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | undefined>(
    undefined
  );

  const isMobile = useMediaQuery("(max-width:768px)");

  const handleAdd = () => {
    setSelectedPersona(undefined);
    setOpenForm(true);
  };

  const handleEdit = (persona: Persona) => {
    setSelectedPersona(persona);
    setOpenForm(true);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir este cambio.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        removePersona(id);
        Swal.fire("Eliminado!", "La persona ha sido eliminada.", "success");
      }
    });
  };

  const handleSave = async (persona: Persona) => {
    try {
      if (persona.id) {
        await editPersona(persona.id, persona);
        Swal.fire(
          "Actualizado",
          "La persona ha sido actualizada correctamente.",
          "success"
        );
      } else {
        await createPersona(persona);
        Swal.fire(
          "Agregado",
          "La persona ha sido agregada correctamente.",
          "success"
        );
      }
      fetchPersonas();
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al guardar la persona.", "error");
    }
    setOpenForm(false);
  };

  // ✅ Columnas del DataGrid con TODOS los datos y las fechas formateadas:
  const columns: GridColDef[] = [
    { field: "nombres", headerName: "Nombres", width: 150 },
    { field: "apellidos", headerName: "Apellidos", width: 150 },
    {
      field: "fechaNacimiento",
      headerName: "Fecha de Nacimiento",
      width: 150,
    },
    {
      field: "fechaRegistro",
      headerName: "Fecha de Registro",
      width: 150,
    },
    { field: "cedula", headerName: "Cédula", width: 150 },
    { field: "ruc", headerName: "RUC", width: 100 },
    {
      field: "digitoVerificador",
      headerName: "Dígito Verificador",
      width: 150,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <>
          <Tooltip title="Editar">
            <IconButton onClick={() => handleEdit(params.row)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gestión de Personas
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Buscar persona..."
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "#6a11cb" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: "50px",
            width: isMobile ? "100%" : "600px",
            backgroundColor: "#f3f3f3",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            borderRadius: "25px",
            height: "40px",
            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
          }}
        >
          Agregar Persona
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : isMobile ? (
        <Grid container spacing={2}>
          {personas.map((persona) => (
            <Grid item xs={12} key={persona.id}>
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* 🔍 Iconos de acciones */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleEdit(persona)}
                    sx={{ color: "#6a11cb" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(persona.id)}
                    sx={{ color: "#d32f2f" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {persona.nombres} {persona.apellidos}
                  </Typography>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>📧 {persona.email}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>📞 {persona.telefono}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>📍 {persona.direccion}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>🎂 {persona.fechaNacimiento}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>🗓️ {persona.fechaRegistro}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>🆔 {persona.cedula}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>🏷️ RUC: {persona.ruc}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>🔢 DV: {persona.digitoVerificador}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <DataGrid
          rows={personas}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
        />
      )}

      <PersonaForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        initialData={selectedPersona}
      />
    </Box>
  );
};

export default PersonasPage;
