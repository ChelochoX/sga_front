import React, { useState } from "react";
import {
  Box,
  Button,
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
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import dayjs from "dayjs";

import { useCursos } from "../hooks/useCursos";
import * as cursosService from "../../../api/cursosService";
import { CursoCard } from "../components/CursoCard";
import FiltroFechaCursos from "../components/FiltroFechaCursos";
import { CursoForm } from "../components/CursoForm";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import {
  gridCursosStyle,
  filtrosContainer,
  cardCursoStyle,
} from "../styles/cursos.styles";
import {
  CursoListado,
  CursoPayload,
  CursoFormValues,
  ObtenerCursosRequest,
} from "../types/cursos.types";
import { formatDateToYYYYMMDD } from "../../../utils/dateUtils";

type CursoDetallePage = Awaited<ReturnType<typeof cursosService.getCursoById>>;
type CursoDetalleConcepto = NonNullable<CursoDetallePage["conceptos"]>[number];
type CursoDetalleVencimiento = NonNullable<
  CursoDetalleConcepto["vencimientos"]
>[number];

const CursosPage: React.FC = () => {
  const { cursos, setCursos, loading, eliminarCurso, fetchCursos } =
    useCursos();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  const [filtrarPorEstado, setFiltrarPorEstado] = useState(false);
  const [soloActivos, setSoloActivos] = useState(true);

  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [cursoSeleccionado, setCursoSeleccionado] =
    useState<CursoDetallePage | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState<number | null>(null);

  const buildFiltros = (): ObtenerCursosRequest => ({
    fechaInicio: formatDateToYYYYMMDD(fechaInicio),
    fechaFin: formatDateToYYYYMMDD(fechaFin),
    activo: filtrarPorEstado ? soloActivos : null,
  });

  const buildCursoPayload = (values: CursoFormValues): CursoPayload => ({
    nombre: values.nombre,
    descripcion: values.descripcion,
    duracion: Number(values.duracion || 0),
    unidadDuracion: values.unidadDuracion,
    fechaInicio: values.fechaInicio
      ? values.fechaInicio.format("YYYY-MM-DD")
      : null,
    fechaFin: values.fechaFin ? values.fechaFin.format("YYYY-MM-DD") : null,
    activo: values.activo,
    conceptos: values.conceptos.map(
      (concepto: CursoFormValues["conceptos"][number]) => ({
        tipoConcepto: concepto.tipoConcepto,
        descripcion: concepto.descripcion,
        activo: concepto.activo,
        vencimientos: concepto.vencimientos.map(
          (
            vencimiento: CursoFormValues["conceptos"][number]["vencimientos"][number],
          ) => ({
            nroOrden: Number(vencimiento.nroOrden || 0),
            monto: Number(vencimiento.monto || 0),
            fechaVencimiento: vencimiento.fechaVencimiento
              ? vencimiento.fechaVencimiento.format("YYYY-MM-DD")
              : "",
            descripcion: vencimiento.descripcion,
            activo: vencimiento.activo,
          }),
        ),
      }),
    ),
  });

  const buildInitialValuesFromDetalle = (
    curso: CursoDetallePage,
  ): CursoFormValues => ({
    nombre: curso.nombre,
    descripcion: curso.descripcion ?? "",
    duracion: curso.duracion,
    unidadDuracion: curso.unidadDuracion,
    fechaInicio: curso.fechaInicio ? dayjs(curso.fechaInicio) : null,
    fechaFin: curso.fechaFin ? dayjs(curso.fechaFin) : null,
    activo: curso.activo,
    conceptos: (curso.conceptos ?? []).map(
      (concepto: CursoDetalleConcepto) => ({
        tipoConcepto: concepto.tipoConcepto,
        descripcion: concepto.descripcion,
        activo: concepto.activo,
        vencimientos: (concepto.vencimientos ?? []).map(
          (vencimiento: CursoDetalleVencimiento) => ({
            nroOrden: vencimiento.nroOrden,
            monto: vencimiento.monto,
            fechaVencimiento: vencimiento.fechaVencimiento
              ? dayjs(vencimiento.fechaVencimiento)
              : null,
            descripcion: vencimiento.descripcion ?? "",
            activo: vencimiento.activo,
          }),
        ),
      }),
    ),
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
      console.error(err);

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

  const handleEditCurso = async (curso: CursoListado) => {
    try {
      const detalle = await cursosService.getCursoById(curso.idCurso);
      setCursoSeleccionado(detalle);
      setOpenEditModal(true);
    } catch (e) {
      console.error(e);
      setError("No se pudo obtener el detalle del curso.");
      setOpenSnackbar(true);
    }
  };

  const handleActualizarCurso = async (values: CursoFormValues) => {
    try {
      if (!cursoSeleccionado) return;

      const payload = buildCursoPayload(values);

      await cursosService.updateCurso(cursoSeleccionado.idCurso, payload);
      setOpenEditModal(false);
      setCursoSeleccionado(null);
      await fetchCursos(buildFiltros());
    } catch (err: any) {
      console.error(err);

      let mensaje = "No se pudo actualizar el curso.";

      if (!err.response) {
        mensaje = "💔 El servidor no está respondiendo. Intenta más tarde.";
      } else if (err.response.data?.Errors?.length > 0) {
        mensaje = err.response.data.Errors.join("\n");
      } else if (err.response.data?.message) {
        mensaje = err.response.data.message;
      }

      setError(mensaje);
      setOpenSnackbar(true);
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
      setCursos((prev) => prev.filter((c) => c.idCurso !== cursoAEliminar));
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar el curso.");
      setOpenSnackbar(true);
    } finally {
      setConfirmOpen(false);
      setCursoAEliminar(null);
    }
  };

  const handleToggleActivo = async (curso: CursoListado, activo: boolean) => {
    setCursos((prev) =>
      prev.map((c) => (c.idCurso === curso.idCurso ? { ...c, activo } : c)),
    );

    try {
      await cursosService.cambiarEstadoCurso(curso.idCurso, activo);
    } catch (e) {
      setCursos((prev) =>
        prev.map((c) =>
          c.idCurso === curso.idCurso ? { ...c, activo: !activo } : c,
        ),
      );
      console.error(e);
      setError("No se pudo cambiar el estado del curso.");
      setOpenSnackbar(true);
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
                  key={curso.idCurso}
                  curso={curso}
                  onEdit={() => handleEditCurso(curso)}
                  onDelete={() => handleEliminarCurso(curso.idCurso)}
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
        maxWidth="md"
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
        maxWidth="md"
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
              initialValues={buildInitialValuesFromDetalle(cursoSeleccionado)}
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
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
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
