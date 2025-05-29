import React from "react";
import { useCursos } from "../hooks/useCursos";
import * as cursosService from "../../../api/cursosService";
import { CursoCard } from "../components/CursoCard";
import FiltroFechaCursos from "../components/FiltroFechaCursos";
import { gridCursosStyle, filtrosContainer } from "../styles/cursos.styles";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  formatDateToYYYYMMDD,
  getTodayYYYYMMDD,
} from "../../../utils/dateUtils";
import { Curso } from "../types/cursos.types";

const CursosPage: React.FC = () => {
  const { cursos, setCursos, loading, fetchCursos } = useCursos();

  // Estado de los filtros de fecha
  const [fechaInicio, setFechaInicio] = React.useState<Date | null>(null);
  const [fechaFin, setFechaFin] = React.useState<Date | null>(null);

  const handleBuscar = () => {
    fetchCursos({
      fechaInicio: formatDateToYYYYMMDD(fechaInicio) || getTodayYYYYMMDD(),
      fechaFin: formatDateToYYYYMMDD(fechaFin) || null,
    });
  };

  const handleToggleActivo = async (curso: Curso, activo: boolean) => {
    setCursos((prev) =>
      prev.map((c) => (c.id_curso === curso.id_curso ? { ...c, activo } : c))
    );
    try {
      await cursosService.cambiarEstadoCurso(curso.id_curso, activo);
    } catch (e) {
      setCursos((prev) =>
        prev.map((c) =>
          c.id_curso === curso.id_curso ? { ...c, activo: !activo } : c
        )
      );
      alert("No se pudo cambiar el estado del curso.");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        alignItems: { xs: "stretch", md: "flex-start" },
        width: "100%",
      }}
    >
      {/* Filtros a la izquierda */}
      <Box sx={filtrosContainer}>
        <FiltroFechaCursos
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
        />
        <Button
          variant="contained"
          sx={{
            bgcolor: "#fc8c29",
            ":hover": { bgcolor: "#ff9500" },
            fontWeight: 600,
          }}
          onClick={handleBuscar}
          fullWidth
        >
          Buscar
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#5947f5",
            ":hover": { bgcolor: "#3e2ad6" },
            fontWeight: 600,
          }}
          fullWidth
          startIcon={<AddIcon />}
        >
          + Agregar
        </Button>
      </Box>

      {/* Cards de cursos */}
      <Box sx={{ flex: 1 }}>
        <div style={gridCursosStyle as React.CSSProperties}>
          {cursos.map((curso) => (
            <CursoCard
              key={curso.id_curso}
              curso={curso}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleActivo={(checked) => handleToggleActivo(curso, checked)}
            />
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default CursosPage;
