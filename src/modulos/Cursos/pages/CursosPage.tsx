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
import { Button, Box, Skeleton, Snackbar, Alert } from "@mui/material"; // <-- agrega Snackbar y Alert
import AddIcon from "@mui/icons-material/Add";
import {
  formatDateToYYYYMMDD,
  getTodayYYYYMMDD,
} from "../../../utils/dateUtils";
import { Curso } from "../types/cursos.types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { CursoForm, CursoFormValues } from "../components/CursoForm";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import dayjs from "dayjs";

const CursosPage: React.FC = () => {
  const { cursos, setCursos, loading, eliminarCurso, fetchCursos } =
    useCursos();
  const [openModal, setOpenModal] = React.useState(false);

  // Estado de los filtros de fecha
  const [fechaInicio, setFechaInicio] = React.useState<Date | null>(null);
  const [fechaFin, setFechaFin] = React.useState<Date | null>(null);

  // Estados para manejo de error bonito
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Nuevo estado para el modal de edición y curso seleccionado
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] =
    React.useState<Curso | null>(null);

  // Abrir Modal de Mensajes
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState<number | null>(null);

  function getLastDayOfMonth(date: Date | null): Date | null {
    if (!date) return null;
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  const handleBuscar = () => {
    let fechaInicioStr = formatDateToYYYYMMDD(fechaInicio);
    let fechaFinStr = formatDateToYYYYMMDD(fechaFin);

    // Si solo selecciona fechaInicio y no fechaFin, buscá TODO el mes
    if (fechaInicio && !fechaFin) {
      const lastDay = getLastDayOfMonth(fechaInicio);
      fechaFinStr = formatDateToYYYYMMDD(lastDay);
    }

    fetchCursos({
      fechaInicio: fechaInicioStr || getTodayYYYYMMDD(),
      fechaFin: fechaFinStr || null,
    });
  };

  // AL CREAR, insertá el curso y refrescá la lista:
  const handleCrearCurso = async (values: CursoFormValues) => {
    // Armá el payload en el handler:
    const payload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      duracion: values.duracion,
      unidadDuracion: values.unidadDuracion,
      cantidadCuota: values.cantidadCuota,
      montoMatricula: values.montoMatricula,
      montoCuota: values.montoCuota,
      tienePractica: values.tienePractica ? "S" : "N",
      costoPractica: values.costoPractica,
      fechaInicio: values.fechaInicio
        ? values.fechaInicio.format("YYYY-MM-DD")
        : null,
      fechaFin: values.fechaFin ? values.fechaFin.format("YYYY-MM-DD") : null,
      activo: values.activo,
    };

    try {
      await cursosService.createCurso(payload);
      setOpenModal(false);
      fetchCursos({
        fechaInicio: formatDateToYYYYMMDD(fechaInicio) || getTodayYYYYMMDD(),
        fechaFin: formatDateToYYYYMMDD(fechaFin) || null,
      });
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

  // Handler para abrir modal de edición
  const handleEditCurso = (curso: Curso) => {
    setCursoSeleccionado(curso);
    setOpenEditModal(true);
  };

  // Handler para actualizar curso
  const handleActualizarCurso = async (data: any) => {
    try {
      if (!cursoSeleccionado) return;
      // Armá el payload igual que en createCurso, respetando los nombres que espera el backend
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        duracion: data.duracion,
        unidadDuracion: data.unidadDuracion,
        cantidadCuota: data.cantidadCuota,
        montoMatricula: data.montoMatricula,
        montoCuota: data.montoCuota,
        tienePractica: data.tienePractica ? "S" : "N",
        costoPractica: data.costoPractica,
        fechaInicio: data.fechaInicio
          ? data.fechaInicio.format("YYYY-MM-DD")
          : null,
        fechaFin: data.fechaFin ? data.fechaFin.format("YYYY-MM-DD") : null,
        activo: data.activo,
      };
      await cursosService.updateCurso(cursoSeleccionado.id_curso, payload);
      setOpenEditModal(false);
      setCursoSeleccionado(null);
      fetchCursos({
        fechaInicio: formatDateToYYYYMMDD(fechaInicio) || getTodayYYYYMMDD(),
        fechaFin: formatDateToYYYYMMDD(fechaFin) || null,
      });
    } catch (e) {
      alert("No se pudo actualizar el curso.");
      console.error(e);
    }
  };

  // Handler para eliminar
  const handleEliminarCurso = (id: number) => {
    setCursoAEliminar(id);
    setConfirmOpen(true);
  };

  const handleConfirmEliminar = async () => {
    if (cursoAEliminar == null) return;
    try {
      await eliminarCurso(cursoAEliminar); // Llama al hook que borra y refresca
    } catch (e) {
      alert("No se pudo eliminar el curso.");
    } finally {
      setConfirmOpen(false);
      setCursoAEliminar(null);
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
            background: "#43a047",
            ":hover": { background: "#388e3c" },
            fontWeight: 600,
            width: { xs: "100%", sm: "100%" },
            color: "#fff",
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
          Agregar
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
                  onEdit={() => handleEditCurso(curso)}
                  onDelete={() => handleEliminarCurso(curso.id_curso)}
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
            onSuccess={() =>
              fetchCursos({
                fechaInicio:
                  formatDateToYYYYMMDD(fechaInicio) || getTodayYYYYMMDD(),
                fechaFin: formatDateToYYYYMMDD(fechaFin) || null,
              })
            }
            modo="crear"
          />
        </DialogContent>
      </Dialog>

      {/* MODAL PARA EDITAR CURSO */}
      <Dialog
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setCursoSeleccionado(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          {cursoSeleccionado && (
            <CursoForm
              initialValues={{
                // Asegurate de mapear correctamente todos los campos:
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
                      "YYYY-MM-DD",
                      "DD/MM/YYYY",
                    ])
                  : null,
                fechaFin: cursoSeleccionado.fecha_fin
                  ? dayjs(cursoSeleccionado.fecha_fin, [
                      "YYYY-MM-DD",
                      "DD/MM/YYYY",
                    ])
                  : null,
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

      {/* SNACKBAR BONITO */}
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

      {/* ------------- MODAL DE CONFIRMACIÓN ------------- */}
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
