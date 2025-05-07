import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { usePersonas } from "../hooks/usePersonas";
import PersonaForm from "../components/PersonaForm";
import { Persona } from "../types/personas.types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const PersonasPage: React.FC = () => {
  const { personas, loading, addPersona, editPersona, removePersona } =
    usePersonas();
  const [openForm, setOpenForm] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | undefined>(
    undefined
  );

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

  const columns: GridColDef[] = [
    {
      field: "nombres",
      headerName: "Nombres",
      width: 150,
    },
    {
      field: "apellidos",
      headerName: "Apellidos",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      width: 150,
    },
    {
      field: "direccion",
      headerName: "Dirección",
      width: 200,
    },
    {
      field: "fechaNacimiento",
      headerName: "Fecha de Nacimiento",
      width: 150,
    },
    {
      field: "cedula",
      headerName: "Cédula",
      width: 150,
    },
    {
      field: "ruc",
      headerName: "RUC",
      width: 150,
    },
    {
      field: "digitoVerificador",
      headerName: "Dígito Verificador",
      width: 150,
    },
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
      <Typography variant="h4" gutterBottom>
        Gestión de Personas
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Agregar Persona
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={personas}
          columns={columns}
          loading={loading}
          onRowClick={handleRowClick}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
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
