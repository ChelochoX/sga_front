import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Paper,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PagosTable from "../components/PagosTable";
import { usePagos } from "../hooks/usePagos";
import { formatFecha } from "../../../utils/dateUtils";

export default function PagosPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filtroAlumno, setFiltroAlumno] = useState<string>("");
  const [filtroFecha, setFiltroFecha] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tab, setTab] = useState<"pendientes" | "realizados">("pendientes");
  const [busquedaActiva, setBusquedaActiva] = useState(false);

  const {
    pagosPendientes,
    pagosRealizados,
    totalPendientes,
    totalRealizados,
    loading,
    error,
    fetchPagosPendientes,
    fetchPagosRealizados,
  } = usePagos();

  const filtro = {
    nombreEstudiante: filtroAlumno || undefined,
    fechaVencimiento: filtroFecha ? formatFecha(filtroFecha) : undefined,
    pageNumber: pageNumber + 1,
    pageSize,
  };

  // Calcular el total general (sumar DeudaTotal de todos los pagos)
  const totalGeneral = (
    tab === "pendientes" ? pagosPendientes : pagosRealizados
  ).reduce((acc, cab) => acc + (cab.deudaTotal || 0), 0);

  const handleBuscar = () => {
    setBusquedaActiva(true);
    setPageNumber(0);
    if (tab === "pendientes") {
      fetchPagosPendientes({ ...filtro, pageNumber: 1, pageSize });
    } else {
      fetchPagosRealizados({ ...filtro, pageNumber: 1, pageSize });
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPageNumber(newPage);
    if (busquedaActiva) {
      if (tab === "pendientes") {
        fetchPagosPendientes({
          ...filtro,
          pageNumber: newPage + 1,
        });
      } else {
        fetchPagosRealizados({
          ...filtro,
          pageNumber: newPage + 1,
        });
      }
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPageNumber(0);
    if (busquedaActiva) {
      if (tab === "pendientes") {
        fetchPagosPendientes({
          ...filtro,
          pageNumber: 1,
          pageSize: newSize,
        });
      } else {
        fetchPagosRealizados({
          ...filtro,
          pageNumber: 1,
          pageSize: newSize,
        });
      }
    }
  };

  const handleTabChange = (_: any, value: "pendientes" | "realizados") => {
    setTab(value);
    setPageNumber(0);
    if (busquedaActiva) {
      if (value === "pendientes") {
        fetchPagosPendientes({ ...filtro, pageNumber: 1, pageSize });
      } else {
        fetchPagosRealizados({ ...filtro, pageNumber: 1, pageSize });
      }
    }
  };

  return (
    <Box p={isMobile ? 1 : 2} maxWidth={1200} mx="auto">
      <Typography variant={isMobile ? "h6" : "h5"} mb={2}>
        Pagos
      </Typography>
      {/* Filtros */}
      <Paper
        sx={{
          p: isMobile ? 1.5 : 2.5,
          mb: 2,
          borderRadius: 3,
          background: "#faf9ff",
          boxShadow: "0 2px 12px 0 #dad0f355",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              label="Buscar alumno"
              fullWidth
              size="small"
              value={filtroAlumno}
              onChange={(e) => setFiltroAlumno(e.target.value)}
              InputProps={{
                style: { borderRadius: 16 },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              label="Fecha de vencimiento"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              InputProps={{
                style: { borderRadius: 16 },
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBuscar}
              sx={{
                background: "linear-gradient(90deg, #6D28D9 70%, #8B5CF6 100%)",
                color: "#fff",
                borderRadius: "30px",
                boxShadow: "0 2px 12px #8B5CF650",
                fontWeight: 600,
                fontSize: "1rem",
                letterSpacing: 1,
                py: 1.2,
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #7c3aed 70%, #a78bfa 100%)",
                },
              }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Total general simple visual arriba a la derecha */}
      {busquedaActiva &&
        (pagosPendientes.length > 0 || pagosRealizados.length > 0) && (
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <Chip
              label={
                <Typography
                  fontWeight={600}
                  color="#6D28D9"
                  sx={{ fontSize: "1.07rem" }}
                >
                  Total general:{" "}
                  {totalGeneral.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                    minimumFractionDigits: 0,
                  })}
                </Typography>
              }
              sx={{
                background: "#f3e8ff",
                color: "#6D28D9",
                fontWeight: 600,
                fontSize: "1.08rem",
                px: 2,
                py: 2,
                boxShadow: "0 1px 4px #a78bfa33",
                borderRadius: 2,
              }}
            />
          </Box>
        )}

      {/* Tabs */}
      <Box
        mt={2}
        mb={3}
        display="flex"
        justifyContent={isMobile ? "center" : "flex-start"}
      >
        <ToggleButtonGroup
          value={tab}
          exclusive
          onChange={handleTabChange}
          size="small"
          sx={{
            borderRadius: 999,
            overflow: "hidden",
            boxShadow: "0 1px 8px 0 #b3a1f7a3",
            ".MuiToggleButton-root": {
              border: 0,
              borderRadius: 999,
              fontWeight: 600,
              textTransform: "none",
              px: 2.2,
              py: 0.6,
              fontSize: "0.96rem",
              color: "#6D28D9",
              background: "#f3f0ff",
              transition: "all 0.2s",
              "&.Mui-selected": {
                color: "#fff",
                background: "linear-gradient(90deg, #6D28D9 70%, #8B5CF6 100%)",
                boxShadow: "0 2px 8px #8B5CF644",
                zIndex: 2,
              },
              "&:hover": {
                background: "#fff7d6",
                color: "#c2410c",
              },
            },
          }}
        >
          <ToggleButton value="pendientes">Pendientes</ToggleButton>
          <ToggleButton
            value="realizados"
            sx={{
              "&.Mui-selected": {
                background: "linear-gradient(90deg, #059669 70%, #34d399 100%)",
                color: "#fff",
                boxShadow: "0 2px 8px #05966944",
              },
              color: "#059669",
            }}
          >
            Realizados
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {/* Tabla/card de pagos */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <PagosTable
          data={tab === "pendientes" ? pagosPendientes : pagosRealizados}
          loading={loading}
          emptyText={`No hay pagos ${
            tab === "pendientes" ? "pendientes" : "realizados"
          } para mostrar`}
          page={pageNumber}
          rowsPerPage={pageSize}
          totalRows={tab === "pendientes" ? totalPendientes : totalRealizados}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          tab={tab}
        />
      )}
      {/* Mensaje de error */}
      {error && (
        <Box mt={2} textAlign="center">
          <Typography color="error">{error}</Typography>
        </Box>
      )}
    </Box>
  );
}
