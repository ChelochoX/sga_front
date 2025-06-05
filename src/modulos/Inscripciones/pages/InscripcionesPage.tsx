import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InscripcionesTable from "../components/InscripcionesTable";
import InscripcionForm from "../components/InscripcionForm";
import { useInscripciones } from "../hooks/useInscripciones";
import { toast } from "react-toastify";

export default function InscripcionesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openForm, setOpenForm] = useState(false);
  const [filtroAlumno, setFiltroAlumno] = useState<string>("");
  const [filtroCurso, setFiltroCurso] = useState<string>("");
  const [filtroDesde, setFiltroDesde] = useState<string>("");
  const [filtroHasta, setFiltroHasta] = useState<string>("");

  const { inscripciones, loading, refetchInscripciones, eliminarInscripcion } =
    useInscripciones();

  useEffect(() => {
    refetchInscripciones();
  }, []);

  const handleBuscar = () => {
    refetchInscripciones(filtroAlumno, filtroCurso, filtroDesde, filtroHasta);
  };

  const handleSuccess = () => {
    refetchInscripciones(filtroAlumno, filtroCurso, filtroDesde, filtroHasta);
    setOpenForm(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarInscripcion(id);
      toast.success("Inscripción eliminada correctamente");
      refetchInscripciones(filtroAlumno, filtroCurso, filtroDesde, filtroHasta);
    } catch (error) {
      toast.error("Error al eliminar la inscripción");
    }
  };

  return (
    <Box p={isMobile ? 1 : 2}>
      <Typography variant={isMobile ? "h6" : "h5"} mb={2}>
        Inscripciones
      </Typography>

      {/* Filtros */}
      <Grid container spacing={1} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Buscar alumno"
            fullWidth
            size="small"
            value={filtroAlumno}
            onChange={(e) => setFiltroAlumno(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Buscar curso"
            fullWidth
            size="small"
            value={filtroCurso}
            onChange={(e) => setFiltroCurso(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <TextField
            label="Desde"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filtroDesde}
            onChange={(e) => setFiltroDesde(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <TextField
            label="Hasta"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filtroHasta}
            onChange={(e) => setFiltroHasta(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button fullWidth variant="contained" onClick={handleBuscar}>
            Buscar
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={2}
          textAlign={isMobile ? "center" : "right"}
        >
          <Button variant="contained" onClick={() => setOpenForm(true)}>
            + Nueva
          </Button>
        </Grid>
      </Grid>

      {/* Lista responsiva (table o cards) o spinner */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <InscripcionesTable
          data={inscripciones}
          onDelete={handleDelete}
          loadingDelete={loading}
        />
      )}

      {/* Formulario modal */}
      <InscripcionForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={handleSuccess}
      />
    </Box>
  );
}
