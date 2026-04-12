import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DocumentoFiscalConfigForm from "../components/DocumentoFiscalConfigForm";
import DocumentosFiscalesConfigTable from "../components/DocumentosFiscalesConfigTable";
import { useDocumentosFiscalesConfig } from "../hooks/useDocumentosFiscalesConfig";
import {
  DocumentoFiscalConfig,
  DocumentoFiscalConfigFiltroRequest,
  DocumentoFiscalConfigRequest,
} from "../types/documentosFiscalesConfig.types";

const DocumentosFiscalesConfigPage: React.FC = () => {
  const {
    items,
    tiposDocumento,
    loading,
    fetchItems,
    fetchTiposDocumento,
    crear,
    actualizar,
    eliminar,
  } = useDocumentosFiscalesConfig();

  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<DocumentoFiscalConfig | null>(null);

  const [filtros, setFiltros] = useState<DocumentoFiscalConfigFiltroRequest>({
    conceptoDocumento: "",
    tipoDocumentoId: undefined,
    activo: undefined,
  });

  useEffect(() => {
    fetchTiposDocumento();
    fetchItems();
  }, [fetchItems, fetchTiposDocumento]);

  const handleBuscar = async () => {
    await fetchItems(filtros);
  };

  const handleNuevo = () => {
    setSelected(null);
    setOpenForm(true);
  };

  const handleEditar = (item: DocumentoFiscalConfig) => {
    setSelected(item);
    setOpenForm(true);
  };

  const handleGuardar = async (
    payload: DocumentoFiscalConfigRequest,
    id?: number,
  ) => {
    if (id) {
      await actualizar(id, payload);
      toast.success("Configuración fiscal actualizada correctamente.");
    } else {
      await crear(payload);
      toast.success("Configuración fiscal creada correctamente.");
    }

    await fetchItems(filtros);
  };

  const handleEliminar = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar configuración?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d32f2f",
    });

    if (!result.isConfirmed) return;

    try {
      await eliminar(id);
      toast.success("Configuración fiscal eliminada correctamente.");
      await fetchItems(filtros);
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.Errors?.[0] ||
        error?.response?.data?.Message ||
        "No se pudo eliminar la configuración.";
      toast.error(mensaje);
    }
  };

  return (
    <Box p={{ xs: 1.5, sm: 2.5 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontSize: { xs: "2rem", sm: "2.1rem" },
          fontWeight: 500,
          color: "#1f1f1f",
        }}
      >
        Configuración de documentos fiscales
      </Typography>

      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2.5,
          borderRadius: 3,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          backgroundColor: "#fff",
        }}
      >
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Concepto documento"
              value={filtros.conceptoDocumento || ""}
              onChange={(e) =>
                setFiltros((prev) => ({
                  ...prev,
                  conceptoDocumento: e.target.value,
                }))
              }
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: 44,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Tipo de documento"
              value={filtros.tipoDocumentoId || ""}
              onChange={(e) =>
                setFiltros((prev) => ({
                  ...prev,
                  tipoDocumentoId: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: 44,
                },
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              {tiposDocumento.map((tipo) => (
                <MenuItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Estado"
              value={
                filtros.activo === undefined
                  ? ""
                  : filtros.activo
                    ? "true"
                    : "false"
              }
              onChange={(e) =>
                setFiltros((prev) => ({
                  ...prev,
                  activo:
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true",
                }))
              }
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: 44,
                },
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Activos</MenuItem>
              <MenuItem value="false">Inactivos</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                display: "flex",
                gap: 1.2,
                justifyContent: { xs: "stretch", md: "flex-end" },
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                onClick={handleBuscar}
                sx={{
                  minWidth: 110,
                  height: 40,
                  px: 2.5,
                  borderRadius: 999,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "0.92rem",
                  backgroundColor: "#4caf50",
                  boxShadow: "0 2px 8px rgba(76,175,80,0.20)",
                  "&:hover": {
                    backgroundColor: "#43a047",
                  },
                }}
              >
                Buscar
              </Button>

              <Button
                variant="contained"
                onClick={handleNuevo}
                sx={{
                  minWidth: 110,
                  height: 40,
                  px: 2.5,
                  borderRadius: 999,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "0.92rem",
                  backgroundColor: "#1976d2",
                  boxShadow: "0 2px 8px rgba(25,118,210,0.20)",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                + Nuevo
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <DocumentosFiscalesConfigTable
          data={items}
          onEdit={handleEditar}
          onDelete={handleEliminar}
        />
      )}

      <DocumentoFiscalConfigForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleGuardar}
        tiposDocumento={tiposDocumento}
        initialData={selected}
        loading={loading}
      />
    </Box>
  );
};

export default DocumentosFiscalesConfigPage;
