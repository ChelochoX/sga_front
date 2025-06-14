import React, { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PagosTable from "../components/PagosTable";
import FacturaModal from "../components/FacturaModal";
import { usePagos } from "../hooks/usePagos";
import { formatFecha } from "../../../utils/dateUtils";
import { facturarPagos } from "../../../api/pagosService";
import { FacturaContadoRequest } from "../types/pagos.types";

export default function PagosPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filtroAlumno, setFiltroAlumno] = useState<string>("");
  const [filtroFecha, setFiltroFecha] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tab, setTab] = useState<"pendientes" | "realizados">("pendientes");
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [openFacturaModal, setOpenFacturaModal] = useState(false);
  const [documentoConfig, setDocumentoConfig] = useState<any>(null);
  const [mensajeErrorConfig, setMensajeErrorConfig] = useState<string | null>(
    null
  );

  const {
    pagosPendientes,
    pagosRealizados,
    totalPendientes,
    totalRealizados,
    loading,
    loadingConfig,
    error,
    fetchPagosPendientes,
    fetchPagosRealizados,
    fetchConfig,
    config,
  } = usePagos();

  useEffect(() => {
    if (config) {
    }
  }, [config]);

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
    setSeleccionados([]);
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
    setSeleccionados([]);
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
    setSeleccionados([]);
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
    setSeleccionados([]);
  };

  const cabeceraSeleccionada = pagosPendientes.find((cab) =>
    cab.detalles.some((d) => seleccionados.includes(d.idDetallePago!))
  );

  // Pagos seleccionados (detalles) para facturar
  const detallesSeleccionados = pagosPendientes
    .flatMap((cab) => cab.detalles)
    .filter((d) => seleccionados.includes(d.idDetallePago!));

  const detallesMapeados = detallesSeleccionados.map((d, idx) => ({
    codigo: `4900270${idx + 1}`,
    concepto: d.concepto ?? "",
    monto: d.monto ?? 0,
    iva: d.monto ? Math.round(d.monto / 11) : 0,
    tipoIva: "10%", // ajustable si más adelante tenés 5% o Exenta
    idPago: cabeceraSeleccionada?.idPago ?? 0,
    idDetallePago: d.idDetallePago ?? 0,
  }));

  const handleConfirmarFactura = async (payload: FacturaContadoRequest) => {
    try {
      await facturarPagos(payload);
      setOpenFacturaModal(false);
      setSeleccionados([]);
      if (tab === "pendientes") {
        fetchPagosPendientes({ ...filtro, pageNumber: 1, pageSize });
      }
    } catch (e) {
      alert("Error al facturar pagos");
    }
  };

  const fechaActual = new Date().toISOString(); // formato válido

  return (
    <Box p={isMobile ? 1 : 2} maxWidth={1200} mx="auto">
      <Typography variant={isMobile ? "h6" : "h5"} mb={2}>
        Pagos - Cuenta Corriente
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

      {/* Tabs y Botón facturar */}
      <Box
        mt={2}
        mb={3}
        display="flex"
        justifyContent={isMobile ? "center" : "space-between"}
        alignItems="center"
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
        {!isMobile && tab === "pendientes" && (
          <Button
            onClick={async () => {
              const mensaje = await fetchConfig("33");
              if (mensaje) {
                setMensajeErrorConfig(mensaje);
                return;
              }
              setOpenFacturaModal(true);
            }}
            disabled={seleccionados.length === 0}
            sx={{
              background: "linear-gradient(90deg,#c026d3 70%,#db2777 100%)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: "999px", // igual que las tabs
              height: 40, // <- AJUSTA AQUÍ según tus ToggleButton (normalmente 38-42px)
              px: 3, // Padding horizontal, similar al de las tabs
              py: 0, // Padding vertical igual que ToggleButton
              minWidth: 120, // ajusta para que no sea gigante
              boxShadow: "0 2px 12px #db277750",
              fontSize: "0.96rem", // igual que ToggleButton
              letterSpacing: 1,
              transition: "all 0.2s",
              ml: 2,
              "&:hover": {
                background: "linear-gradient(90deg,#a21caf 70%,#db2777 100%)",
              },
              // Opcional: border o borde para aún más similaridad
              // border: "1px solid #e0e0e0",
            }}
          >
            Facturar seleccionados
          </Button>
        )}
      </Box>

      {/* Tabla/card de pagos */}
      {loading || loadingConfig ? (
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
          seleccionados={seleccionados}
          onSeleccionarDetalle={setSeleccionados}
        />
      )}

      {/* Botón facturar para móvil */}
      {isMobile && tab === "pendientes" && (
        <Button
          onClick={async () => {
            const mensaje = await fetchConfig("33");
            if (mensaje) {
              setMensajeErrorConfig(mensaje);
              return;
            }
            setOpenFacturaModal(true);
          }}
          disabled={seleccionados.length === 0}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(90deg,#c026d3 70%,#db2777 100%)",
            color: "#fff",
            fontWeight: 700,
            borderRadius: "999px", // Igual que desktop
            height: 40,
            px: 3,
            py: 0,
            minWidth: 120,
            fontSize: "0.96rem",
            letterSpacing: 1,
            zIndex: 1200,
            boxShadow: "0 2px 12px #db277750",
            transition: "all 0.2s",
            "&:hover": {
              background: "linear-gradient(90deg,#a21caf 70%,#db2777 100%)",
            },
          }}
        >
          Facturar seleccionados
        </Button>
      )}

      {/* Modal de factura */}
      <FacturaModal
        open={openFacturaModal}
        onClose={() => setOpenFacturaModal(false)}
        detalles={detallesMapeados}
        config={config}
        fechaEmision={fechaActual}
        loading={false}
        onConfirmar={handleConfirmarFactura}
        estudiante={cabeceraSeleccionada?.nombreEstudiante ?? ""}
        direccion={cabeceraSeleccionada?.direccionEstudiante ?? "-"}
        ruc={cabeceraSeleccionada?.rucEstudiante ?? "-"}
        telefono={cabeceraSeleccionada?.telefonoEstudiante ?? "-"}
      />

      {/* Mensaje de error */}
      {error && (
        <Box mt={2} textAlign="center">
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Snackbar
        open={!!mensajeErrorConfig}
        onClose={() => setMensajeErrorConfig(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setMensajeErrorConfig(null)}
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            background: "#ef4444", // rojo pálido
            color: "#fff", // blanco brillante
            fontWeight: "bold",
            fontSize: "1rem",
            letterSpacing: "0.5px",
          }}
          iconMapping={{
            error: (
              <span style={{ fontSize: "1.4rem", marginRight: 8 }}>❗</span>
            ),
          }}
        >
          {mensajeErrorConfig}
        </Alert>
      </Snackbar>
    </Box>
  );
}
