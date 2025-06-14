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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCajaMovimientos } from "../hooks/useCaja";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CajaMovimientosTable from "../components/MovimientosTable";

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value ?? "" });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Movimientos de Caja
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              name="desde"
              label="Desde"
              type="date"
              fullWidth
              value={filtros.desde || ""}
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
              value={filtros.hasta || ""}
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
      ) : (
        <>
          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
            Total del día:{" "}
            {totalDelDia !== undefined ? totalDelDia.toLocaleString() : "0"}
          </Typography>
          <CajaMovimientosTable
            movimientos={movimientos}
            onAnular={anularFactura}
          />
        </>
      )}
    </Box>
  );
};
export default CajaMovimientosPage;
