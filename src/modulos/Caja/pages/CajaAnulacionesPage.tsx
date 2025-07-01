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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useCajaMovimientos } from "../hooks/useCaja";
import AnulacionesTable from "../components/AnulacionesTable";

const CajaAnulacionesPage: React.FC = () => {
  const { anulaciones, loading, filtros, setFiltros, buscarAnulaciones } =
    useCajaMovimientos();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value ?? "" });
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
      ) : anulaciones.length === 0 ? (
        <Typography>No hay anulaciones registradas.</Typography>
      ) : (
        <AnulacionesTable anulaciones={anulaciones} />
      )}
    </Box>
  );
};

export default CajaAnulacionesPage;
