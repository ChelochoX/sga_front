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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PagosTable from "../components/PagosTable";
import { usePagos } from "../hooks/usePagos";

export default function PagosPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filtroAlumno, setFiltroAlumno] = useState<string>("");
  const [filtroFecha, setFiltroFecha] = useState<string>("");
  const [tab, setTab] = useState<"pendientes" | "realizados">("pendientes");

  const {
    pagosPendientes,
    pagosRealizados,
    loading,
    error,
    fetchPagosPendientes,
    fetchPagosRealizados,
  } = usePagos();

  const handleBuscar = () => {
    if (tab === "pendientes") {
      fetchPagosPendientes(filtroAlumno, filtroFecha);
    } else {
      fetchPagosRealizados(filtroAlumno, filtroFecha);
    }
  };

  return (
    <Box p={isMobile ? 1 : 2}>
      <Typography variant={isMobile ? "h6" : "h5"} mb={2}>
        Pagos
      </Typography>
      {/* Filtros */}
      <Grid container spacing={1} mb={2} alignItems="center">
        <Grid item xs={12} sm={5} md={5}>
          <TextField
            label="Buscar alumno"
            fullWidth
            size="small"
            value={filtroAlumno}
            onChange={(e) => setFiltroAlumno(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            label="Fecha de vencimiento"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleBuscar}
            sx={{ minWidth: 120 }}
          >
            Buscar
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={2}
          textAlign={isMobile ? "center" : "right"}
        >
          <ToggleButtonGroup
            value={tab}
            exclusive
            onChange={(_, value) => value && setTab(value)}
            size="small"
            sx={{
              background: "#ededed",
              borderRadius: 4,
              "& .Mui-selected": {
                background: theme.palette.primary.main,
                color: "#fff",
              },
            }}
          >
            <ToggleButton value="pendientes">Pendientes</ToggleButton>
            <ToggleButton value="realizados">Realizados</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

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
