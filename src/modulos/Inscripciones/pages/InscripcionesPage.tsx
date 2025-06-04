// src/modulos/Inscripciones/components/InscripcionesPage.tsx
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import InscripcionesTable from "../components/InscripcionesTable";
import InscripcionForm from "../components/InscripcionForm";
import { Inscripcion } from "../types/inscripciones.types";
// import { getInscripciones } from "../../../api/inscripcionesService";  <-- Quitamos por ahora

export default function InscripcionesPage() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const fetchInscripciones = async () => {
    setLoading(true);
    try {
      // Por ahora simulamos con un arreglo vacío o con datos estáticos.
      // Cuando tengas el servicio, reemplaza esto por:
      // const data = await getInscripciones();
      // setInscripciones(data);
      setInscripciones([]); // <-- Simulación: por defecto vacío
    } catch (error) {
      console.error("Error al obtener inscripciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscripciones();
  }, []);

  return (
    <Box p={2}>
      {/* Encabezado con título y botón “Nueva” */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Inscripciones</Typography>
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          + Nueva
        </Button>
      </Box>

      {/* Mostrar spinner mientras carga */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        // ────────────────────────────────────────────────────────────
        // Llamamos a la tabla sin paginación
        <InscripcionesTable datos={inscripciones} />
      )}

      {/* Dialogo para crear nueva inscripción */}
      <InscripcionForm open={openForm} onClose={() => setOpenForm(false)} />
    </Box>
  );
}
