import React, { useState } from "react";
import { useCursos } from "../hooks/useCursos";
import * as cursosService from "../../../api/cursosService";
import { CursoCard } from "../components/CursoCard";
import FiltroFechaCursos from "../components/FiltroFechaCursos";
import {
  gridCursosStyle,
  filtrosContainer,
  cardCursoStyle,
} from "../styles/cursos.styles";
import {
  Button,
  Box,
  Skeleton,
  Snackbar,
  Alert,
  Divider,
  Typography,
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { formatDateToYYYYMMDD } from "../../../utils/dateUtils";
import { Curso, CursoPayload } from "../types/cursos.types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { CursoForm, CursoFormValues } from "../components/CursoForm";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import dayjs from "dayjs";

const CursosPage: React.FC = () => {
  const { cursos, setCursos, loading, eliminarCurso, fetchCursos } =
    useCursos();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openModal, setOpenModal] = useState(false);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  const [filtrarPorEstado, setFiltrarPorEstado] = useState(false);
  const [soloActivos, setSoloActivos] = useState(true);

  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(
    null,
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState<number | null>(null);

  const buildFiltros = () => ({
    fechaInicio: formatDateToYYYYMMDD(fechaInicio),
    fechaFin: formatDateToYYYYMMDD(fechaFin),
    activo: filtrarPorEstado ? soloActivos : null,
  });

  const toNumber = (value: number | ""): number => {
    return value === "" ? 0 : value;
  };

  const buildCursoPayload = (values: CursoFormValues): CursoPayload => ({
    nombre: values.nombre,
    descripcion: values.descripcion,
    duracion: toNumber(values.duracion),
    unidadDuracion: values.unidadDuracion,
    cantidadCuota: toNumber(values.cantidadCuota),
    montoMatricula: toNumber(values.montoMatricula),
    montoCuota: toNumber(values.montoCuota),
    tienePractica: values.tienePractica ? "S" : "N",
    costoPractica: toNumber(values.costoPractica),
    fechaInicio: values.fechaInicio
      ? values.fechaInicio.format("YYYY-MM-DD")
      : null,
    fechaFin: values.fechaFin ? values.fechaFin.format("YYYY-MM-DD") : null,
    activo: values.activo,
  });

  const handleBuscar = async () => {
    try {
      await fetchCursos(buildFiltros());
    } catch (e) {
      console.error(e);
      setError("No se pudieron obtener los cursos.");
      setOpenSnackbar(true);
    }
  };

  const handleCrearCurso = async (values: CursoFormValues) => {
    const payload = buildCursoPayload(values);

    try {
      await cursosService.createCurso(payload);
      setOpenModal(false);
      await fetchCursos(buildFiltros());
    } catch (err: any) {
      let mensaje = "❌ Ocurrió un error inesperado.";

      if (!err.response) {
        mensaje = "💔 El servidor no está respondiendo. Intenta más tarde.";
      } else if (err.response.data?.Errors?.length > 0) {
        mensaje = `🔒 ${err.response.data.Errors.join("\n")}`;
      } else if (err.response.data?.message) {
        mensaje = `⚠️ ${err.response.data.message}`;
      }

      setError(mensaje);
      setOpenSnackbar(true);
    }
  };

  const handleEditCurso = (curso: Curso) => {
    setCursoSeleccionado(curso);
    setOpenEditModal(true);
  };

  const handleActualizarCurso = async (data: CursoFormValues) => {
    try {
      if (!cursoSeleccionado) return;

      const payload = buildCursoPayload(data);

      await cursosService.updateCurso(cursoSeleccionado.id_curso, payload);
      setOpenEditModal(false);
      setCursoSeleccionado(null);
      await fetchCursos(buildFiltros());
    } catch (e) {
      alert("No se pudo actualizar el curso.");
      console.error(e);
    }
  };

  const handleEliminarCurso = (id: number) => {
    setCursoAEliminar(id);
    setConfirmOpen(true);
  };

  const handleConfirmEliminar = async () => {
    if (cursoAEliminar == null) return;

    try {
      await eliminarCurso(cursoAEliminar);
      setCursos((prev) => prev.filter((c) => c.id_curso !== cursoAEliminar));
    } catch (e) {
      alert("No se pudo eliminar el curso.");
      console.error(e);
    } finally {
      setConfirmOpen(false);
      setCursoAEliminar(null);
    }
  };

  const handleToggleActivo = async (curso: Curso, activo: boolean) => {
    setCursos((prev) =>
      prev.map((c) => (c.id_curso === curso.id_curso ? { ...c, activo } : c)),
    );

    try {
      await cursosService.cambiarEstadoCurso(curso.id_curso, activo);
    } catch (e) {
      setCursos((prev) =>
        prev.map((c) =>
          c.id_curso === curso.id_curso ? { ...c, activo: !activo } : c,
        ),
      );
      alert("No se pudo cambiar el estado del curso.");
      console.error(e);
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
      <Box
        sx={{
          ...filtrosContainer,
          alignItems: { xs: "center", md: "stretch" },
          width: { xs: "100%", sm: "320px", md: "260px" },
          minWidth: { md: "220px" },
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "#5947f5",
            ":hover": { bgcolor: "#3e2ad6" },
            fontWeight: 600,
            width: "100%",
          }}
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Agregar
        </Button>

        <Divider flexItem />

        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Opciones de búsqueda
        </Typography>

        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            px: 2,
            py: 1,
            backgroundColor: "#fafafa",
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={filtrarPorEstado}
                onChange={(e) => setFiltrarPorEstado(e.target.checked)}
                color="primary"
              />
            }
            label="Filtrar por estado"
          />

          <FormControlLabel
            control={
              <Switch
                checked={soloActivos}
                onChange={(e) => setSoloActivos(e.target.checked)}
                color="success"
                disabled={!filtrarPorEstado}
              />
            }
            label={soloActivos ? "Activos" : "Inactivos"}
          />
        </Box>

        <Divider flexItem />

        <FiltroFechaCursos
          fechaInicio={fechaInicio}
          setFechaInicio={setFechaInicio}
          fechaFin={fechaFin}
          setFechaFin={setFechaFin}
        />

        <Divider flexItem />

        <Button
          variant="contained"
          sx={{
            background: "#43a047",
            ":hover": { background: "#388e3c" },
            fontWeight: 600,
            width: "100%",
            color: "#fff",
          }}
          onClick={handleBuscar}
          fullWidth
        >
          Buscar
        </Button>
      </Box>

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
                  onEdit={() => handleEditCurso(curso)}
                  onDelete={() => handleEliminarCurso(curso.id_curso)}
                  onToggleActivo={(checked) =>
                    handleToggleActivo(curso, checked)
                  }
                />
              ))}
        </div>
      </Box>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            m: { xs: 0, sm: 2 },
            width: { xs: "100%", sm: "100%" },
            maxHeight: { xs: "100dvh", sm: "90dvh" },
          },
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            overflowY: "auto",
          }}
        >
          <CursoForm
            onSubmit={handleCrearCurso}
            onCancel={() => setOpenModal(false)}
            modo="crear"
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setCursoSeleccionado(null);
        }}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            m: { xs: 0, sm: 2 },
            width: { xs: "100%", sm: "100%" },
            maxHeight: { xs: "100dvh", sm: "90dvh" },
          },
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            overflowY: "auto",
          }}
        >
          {cursoSeleccionado && (
            <CursoForm
              initialValues={{
                nombre: cursoSeleccionado.nombre,
                descripcion: cursoSeleccionado.descripcion,
                duracion: cursoSeleccionado.duracion,
                unidadDuracion: cursoSeleccionado.unidad_duracion,
                cantidadCuota: cursoSeleccionado.cantidad_cuota,
                montoMatricula: cursoSeleccionado.monto_matricula,
                montoCuota: cursoSeleccionado.monto_cuota,
                tienePractica: cursoSeleccionado.tiene_practica,
                costoPractica: cursoSeleccionado.costo_practica,
                fechaInicio: cursoSeleccionado.fecha_inicio
                  ? dayjs(cursoSeleccionado.fecha_inicio, [
                      "DD/MM/YYYY",
                      "YYYY-MM-DD",
                    ])
                  : null,
                fechaFin: cursoSeleccionado.fecha_fin
                  ? dayjs(cursoSeleccionado.fecha_fin, [
                      "DD/MM/YYYY",
                      "YYYY-MM-DD",
                    ])
                  : null,
                activo: cursoSeleccionado.activo,
              }}
              onSubmit={handleActualizarCurso}
              onCancel={() => {
                setOpenEditModal(false);
                setCursoSeleccionado(null);
              }}
              modo="editar"
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={null}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error.includes("🔒") ? "warning" : "error"}
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar curso"
        content="¿Seguro que deseas eliminar este curso? Esta acción no se puede deshacer."
        onConfirm={handleConfirmEliminar}
        onCancel={() => {
          setConfirmOpen(false);
          setCursoAEliminar(null);
        }}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </Box>
  );
};

export default CursosPage;
