import React from "react";
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
import CajaMovimientosTable from "../components/MovimientosTable";
import { descargarPdfFacturaPorMovimiento } from "../../../api/facturaPdfService";

const primaryGradientButtonSx = {
  borderRadius: "999px",
  px: 4,
  py: 1.2,
  fontWeight: 700,
  textTransform: "none",
  background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 100%)",
  color: "#fff",
  boxShadow: "0 6px 18px rgba(124, 58, 237, 0.25)",
  "&:hover": {
    background: "linear-gradient(90deg, #6d28d9 0%, #db2777 100%)",
    boxShadow: "0 8px 20px rgba(124, 58, 237, 0.35)",
  },
};

const CajaMovimientosPage: React.FC = () => {
  const {
    movimientos,
    loading,
    error,
    filtros,
    setFiltros,
    buscarMovimientos,
    anularFactura,
    totalDelDia,
  } = useCajaMovimientos();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImprimir = async (idMovimiento: number) => {
    try {
      await descargarPdfFacturaPorMovimiento(idMovimiento);
    } catch (err: any) {
      console.error("❌ Error al imprimir factura por movimiento:", err);

      const mensaje =
        err?.response?.data?.Errors?.[0] ||
        err?.response?.data?.mensaje ||
        "No se pudo generar el PDF de la factura.";

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
        Movimientos de Caja
      </Typography>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
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
              onClick={buscarMovimientos}
              sx={primaryGradientButtonSx}
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
      ) : (
        <>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Total del día: {totalDelDia.toLocaleString("es-PY")}
          </Typography>

          <CajaMovimientosTable
            movimientos={movimientos}
            onAnular={anularFactura}
            onImprimir={handleImprimir}
          />
        </>
      )}
    </Box>
  );
};

export default CajaMovimientosPage;
