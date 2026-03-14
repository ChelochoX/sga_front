import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Swal from "sweetalert2";
import { useCajaMovimientos } from "../hooks/useCaja";
import AnulacionesTable from "../components/AnulacionesTable";
import { descargarPdfFacturaPorAnulacion } from "../../../api/facturaPdfService";

const CajaAnulacionesPage: React.FC = () => {
  const {
    anulaciones,
    loading,
    error,
    filtros,
    setFiltros,
    buscarAnulaciones,
  } = useCajaMovimientos();

  useEffect(() => {
    buscarAnulaciones();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImprimir = async (idAnulacion: number) => {
    try {
      await descargarPdfFacturaPorAnulacion(idAnulacion);
    } catch (err: any) {
      console.error("❌ Error al imprimir factura anulada:", err);

      const mensaje =
        err?.response?.data?.Errors?.[0] ||
        err?.response?.data?.mensaje ||
        "No se pudo generar el PDF de la factura anulada.";

      await Swal.fire({
        icon: "error",
        title: "No se pudo imprimir",
        text: mensaje,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Anulaciones de Caja
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              name="desde"
              label="Desde"
              type="date"
              fullWidth
              value={filtros.desde}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 5 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              name="hasta"
              label="Hasta"
              type="date"
              fullWidth
              value={filtros.hasta}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 5 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={buscarAnulaciones}
              sx={{ height: "100%", borderRadius: 5 }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : anulaciones.length === 0 ? (
        <Typography>No hay anulaciones registradas.</Typography>
      ) : (
        <AnulacionesTable
          anulaciones={anulaciones}
          onImprimir={handleImprimir}
        />
      )}
    </Box>
  );
};

export default CajaAnulacionesPage;
