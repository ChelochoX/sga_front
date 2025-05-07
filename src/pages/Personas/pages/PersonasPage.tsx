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
  CardActions,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { usePersonas } from "../hooks/usePersonas";
import PersonaForm from "../components/PersonaForm";
import { Persona } from "../types/personas.types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const PersonasPage: React.FC = () => {
  const { personas, loading, addPersona, editPersona, removePersona } =
    usePersonas();
  const [openForm, setOpenForm] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | undefined>(
    undefined
  );

  // ✅ Detectar si estamos en modo móvil (ancho menor a 768px)
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
    if (window.confirm("¿Estás seguro de eliminar esta persona?")) {
      removePersona(id);
    }
  };

  const handleSave = (persona: Persona) => {
    if (persona.id) {
      editPersona(persona.id, persona);
    } else {
      addPersona(persona);
    }
  };

  const handleRowClick = (params: GridRowParams) => {
    const persona = personas.find((p) => p.id === params.id);
    if (persona) {
      handleEdit(persona);
    }
  };

  // ✅ Columnas del DataGrid
  const columns: GridColDef[] = [
    { field: "nombres", headerName: "Nombres", width: 150 },
    { field: "apellidos", headerName: "Apellidos", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "telefono", headerName: "Teléfono", width: 150 },
    { field: "direccion", headerName: "Dirección", width: 200 },
    { field: "cedula", headerName: "Cédula", width: 150 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const persona = personas.find((p) => p.id === params.id);
        return (
          <>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => persona && handleEdit(persona)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => handleDelete(params.id as number)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* ✅ Título adaptable según el tamaño de pantalla */}
      <Typography
        variant={isMobile ? "h5" : "h4"} // Ajuste de tamaño
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: isMobile ? "center" : "left", // Centrar en móvil
        }}
      >
        Gestión de Personas
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{
          mb: 2,
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
        }}
      >
        Agregar Persona
      </Button>

      {loading ? (
        <CircularProgress />
      ) : isMobile ? (
        // ✅ MODO MÓVIL - Tarjetas
        <Grid container spacing={2}>
          {personas.map((persona) => (
            <Grid item xs={12} key={persona.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {persona.nombres} {persona.apellidos}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    📧 {persona.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    📞 {persona.telefono}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    🏠 {persona.direccion}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    📑 {persona.cedula}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(persona)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(persona.id!)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <DataGrid
          rows={personas}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.idPersona!}
          onRowClick={handleRowClick}
          autoHeight
          pageSizeOptions={[5, 10, 20, 100]}
          disableRowSelectionOnClick
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
