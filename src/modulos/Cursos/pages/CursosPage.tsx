import React from "react";
import { useCursos } from "../hooks/useCursos";
import * as cursosService from "../../../api/cursosService";
import { CursoCard } from "../components/CursoCard";
import FiltroFechaCursos from "../components/FiltroFechaCursos";
import {
  gridCursosStyle,
  filtrosContainer,
  cardCursoStyle,
} from "../styles/cursos.styles";
import { Button, Box, Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  formatDateToYYYYMMDD,
  getTodayYYYYMMDD,
} from "../../../utils/dateUtils";
import { Curso } from "../types/cursos.types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

// AGREGÁ el import de tu formulario:
import { CursoForm } from "../components/CursoForm";

const CursosPage: React.FC = () => {
  const { cursos, setCursos, loading, fetchCursos } = useCursos();
  const [openModal, setOpenModal] = React.useState(false);

  // Estado de los filtros de fecha
  const [fechaInicio, setFechaInicio] = React.useState<Date | null>(null);
  const [fechaFin, setFechaFin] = React.useState<Date | null>(null);

  const handleBuscar = () => {
    fetchCursos({
      fechaInicio: formatDateToYYYYMMDD(fechaInicio) || getTodayYYYYMMDD(),
      fechaFin: formatDateToYYYYMMDD(fechaFin) || null,
    });
  };

  // AL CREAR, insertá el curso y refrescá la lista:
  const handleCrearCurso = async (data: any) => {
    try {
      await cursosService.createCurso(data);
      setOpenModal(false);
      fetchCursos({
        fechaInicio: formatDateToYYYYMMDD(fechaInicio) || getTodayYYYYMMDD(),
        fechaFin: formatDateToYYYYMMDD(fechaFin) || null,
      });
    } catch (e) {
      alert("No se pudo crear el curso.");
    }
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        alignItems: { xs: "center", md: "flex-start" },
        width: "100%",
      }}
    >
      {/* Filtros a la izquierda */}
      <Box
        sx={{
          ...filtrosContainer,
          alignItems: { xs: "center", md: "stretch" },
          width: { xs: "100%", sm: "320px", md: "230px" },
          minWidth: { md: "200px" },
        }}
      >
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
            width: { xs: "100%", sm: "100%" },
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
            width: { xs: "100%", sm: "100%" },
          }}
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          + Agregar
        </Button>
      </Box>

      {/* Cards de cursos */}
      <Box sx={{ flex: 1 }}>
        <div style={gridCursosStyle as React.CSSProperties}>
          {loading
            ? [...Array(4)].map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    ...cardCursoStyle,
                    borderRadius: 10,
                    minHeight: 360,
                    maxWidth: 380,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 3,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={26}
                    sx={{ mb: 1, borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={28}
                    sx={{ mb: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={22}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={22}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="90%"
                    height={32}
                    sx={{ mt: 2, borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="50%"
                    height={32}
                    sx={{ mt: 1, borderRadius: 1 }}
                  />
                </Box>
              ))
            : cursos.map((curso) => (
                <CursoCard
                  key={curso.id_curso}
                  curso={curso}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onToggleActivo={(checked) =>
                    handleToggleActivo(curso, checked)
                  }
                />
              ))}
        </div>
      </Box>

      {/* MODAL PARA AGREGAR CURSO */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <CursoForm
            onSubmit={handleCrearCurso}
            onCancel={() => setOpenModal(false)}
            modo="crear"
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CursosPage;
