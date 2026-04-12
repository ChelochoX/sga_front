import React from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TablePagination,
  Box,
  useMediaQuery,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Checkbox,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PagoCabeceraDto } from "../types/pagos.types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface Props {
  data: PagoCabeceraDto[];
  loading?: boolean;
  emptyText?: string;
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tab: "pendientes" | "realizados";
  seleccionados: number[];
  onSeleccionarDetalle: (ids: number[]) => void;
}

const formatearMonto = (monto?: number | null) =>
  (Number(monto ?? 0) || 0).toLocaleString("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
  });

const formatearFecha = (fecha?: string | null) => {
  if (!fecha) return "-";
  const soloFecha = fecha.includes("T") ? fecha.split("T")[0] : fecha;
  if (!soloFecha) return "-";

  const partes = soloFecha.split("-");
  if (partes.length === 3) {
    const [anio, mes, dia] = partes;
    return `${dia}/${mes}/${anio}`;
  }

  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("es-PY");
};

export default function PagosTable({
  seleccionados,
  onSeleccionarDetalle,
  data,
  loading = false,
  emptyText,
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  tab,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = React.useState<number | null>(null);

  const obtenerIdPagoDeDetalle = (detalleId: number): number | null => {
    for (const cab of data) {
      if (cab.detalles.some((d) => d.idDetallePago === detalleId)) {
        return cab.idPago;
      }
    }
    return null;
  };

  const handleCheck = (idDetalle: number, idPagoActual: number) => {
    const yaSeleccionado = seleccionados.includes(idDetalle);

    if (yaSeleccionado) {
      onSeleccionarDetalle(seleccionados.filter((i) => i !== idDetalle));
      return;
    }

    const primerSeleccionado = seleccionados[0];
    if (!primerSeleccionado) {
      onSeleccionarDetalle([...seleccionados, idDetalle]);
      return;
    }

    const idPagoSeleccionado = obtenerIdPagoDeDetalle(primerSeleccionado);

    if (idPagoSeleccionado !== idPagoActual) {
      onSeleccionarDetalle([idDetalle]);
      return;
    }

    onSeleccionarDetalle([...seleccionados, idDetalle]);
  };

  if (isMobile) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {loading ? (
          <Typography align="center">Cargando...</Typography>
        ) : data.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            {emptyText || "Sin registros todavía"}
          </Typography>
        ) : (
          data.map((cab) => (
            <Card key={cab.idPago} elevation={2}>
              <CardContent>
                <Typography fontWeight={700} mb={0.5}>
                  {cab.nombreEstudiante}
                </Typography>
                <Typography fontWeight={600} color="primary" mb={1}>
                  {cab.nombreCurso}
                </Typography>

                <Typography variant="body2">
                  <b>Deuda Total:</b> {formatearMonto(cab.deudaTotal)}
                </Typography>

                <Typography variant="body2">
                  <b>Tipo Cuenta:</b> {cab.tipoCuenta}
                </Typography>

                <Typography variant="body2">
                  <b>Descuento:</b> {formatearMonto(cab.descuentoCabecera)}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <b>Observación:</b> {cab.observacion || "-"}
                </Typography>

                <Box mt={2}>
                  <Typography fontWeight={700} fontSize={15} mb={1}>
                    Detalles de cuotas
                  </Typography>

                  {cab.detalles.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Sin cuotas
                    </Typography>
                  ) : (
                    cab.detalles.map((det, idx) => (
                      <Box
                        key={idx}
                        mb={1}
                        p={1.2}
                        bgcolor="#f3f0ff"
                        borderRadius={2}
                        display="flex"
                        alignItems="flex-start"
                        gap={1}
                      >
                        {tab === "pendientes" && (
                          <Checkbox
                            checked={seleccionados.includes(det.idDetallePago!)}
                            onChange={() =>
                              handleCheck(det.idDetallePago!, cab.idPago)
                            }
                            disabled={det.estado !== "Pendiente"}
                          />
                        )}

                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={600}>
                            {det.concepto}
                          </Typography>

                          <Typography variant="body2">
                            <b>Monto:</b> {formatearMonto(det.monto)}
                          </Typography>

                          <Typography variant="body2">
                            <b>Vencimiento:</b>{" "}
                            {formatearFecha(det.fechaVencimiento)}
                          </Typography>

                          {tab === "realizados" && (
                            <>
                              <Typography variant="body2">
                                <b>Pago:</b> {formatearFecha(det.fechaPago)}
                              </Typography>
                              <Typography variant="body2">
                                <b>Tipo Pago:</b> {det.tipoPago || "-"}
                              </Typography>
                              <Typography variant="body2">
                                <b>Referencia:</b> {det.referencia || "-"}
                              </Typography>
                              <Typography variant="body2">
                                <b>Voucher:</b> {det.voucherNumero || "-"}
                              </Typography>
                            </>
                          )}

                          <Box mt={0.7}>
                            <Chip
                              label={det.estado || "-"}
                              size="small"
                              color={
                                det.estado === "Pendiente"
                                  ? "warning"
                                  : det.estado === "Pagado"
                                    ? "success"
                                    : "default"
                              }
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Curso</TableCell>
              <TableCell>Estudiante</TableCell>
              <TableCell>Deuda Total</TableCell>
              <TableCell>Tipo Cuenta</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Observación</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Cargando...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="primary">
                    {emptyText || "Sin registros todavía"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((cabecera, idx) => (
                <React.Fragment key={cabecera.idPago}>
                  <TableRow
                    sx={{
                      background: "#faf9ff",
                      "&:hover": {
                        background: "#e8e3ff",
                        transition: "background 0.2s",
                      },
                      borderBottom: "2px solid #eee",
                    }}
                  >
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(open === idx ? null : idx)}
                        sx={{
                          transition: "0.2s",
                          background: open === idx ? "#ede7f6" : undefined,
                        }}
                      >
                        {open === idx ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>

                    <TableCell>{cabecera.nombreCurso}</TableCell>
                    <TableCell>{cabecera.nombreEstudiante}</TableCell>
                    <TableCell>{formatearMonto(cabecera.deudaTotal)}</TableCell>
                    <TableCell>{cabecera.tipoCuenta}</TableCell>
                    <TableCell>
                      {formatearMonto(cabecera.descuentoCabecera)}
                    </TableCell>
                    <TableCell>{cabecera.observacion}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0, background: "#f9f7fd" }}>
                      <Collapse in={open === idx} timeout="auto" unmountOnExit>
                        <Box m={2} mb={3}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            gutterBottom
                            sx={{ mb: 1.5, color: "#7c3aed" }}
                          >
                            Detalles de cuotas
                          </Typography>

                          <Table size="small" sx={{ background: "#fff" }}>
                            <TableHead>
                              <TableRow>
                                {tab === "pendientes" && <TableCell />}
                                <TableCell>Concepto</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell>Vencimiento</TableCell>
                                {tab === "realizados" && (
                                  <>
                                    <TableCell>Pago</TableCell>
                                    <TableCell>Tipo de Pago</TableCell>
                                    <TableCell>Referencia</TableCell>
                                    <TableCell>Voucher</TableCell>
                                  </>
                                )}
                                <TableCell>Estado</TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {cabecera.detalles.map((detalle, j) => (
                                <TableRow
                                  key={j}
                                  sx={{
                                    "&:hover": {
                                      background: "#ede7f6",
                                    },
                                  }}
                                >
                                  {tab === "pendientes" && (
                                    <TableCell>
                                      <Checkbox
                                        checked={seleccionados.includes(
                                          detalle.idDetallePago!,
                                        )}
                                        onChange={() =>
                                          handleCheck(
                                            detalle.idDetallePago!,
                                            cabecera.idPago,
                                          )
                                        }
                                        disabled={
                                          detalle.estado !== "Pendiente"
                                        }
                                      />
                                    </TableCell>
                                  )}

                                  <TableCell>{detalle.concepto}</TableCell>
                                  <TableCell>
                                    {formatearMonto(detalle.monto)}
                                  </TableCell>
                                  <TableCell>
                                    {formatearFecha(detalle.fechaVencimiento)}
                                  </TableCell>

                                  {tab === "realizados" && (
                                    <>
                                      <TableCell>
                                        {formatearFecha(detalle.fechaPago)}
                                      </TableCell>
                                      <TableCell>
                                        {detalle.tipoPago || "-"}
                                      </TableCell>
                                      <TableCell>
                                        {detalle.referencia || "-"}
                                      </TableCell>
                                      <TableCell>
                                        {detalle.voucherNumero || "-"}
                                      </TableCell>
                                    </>
                                  )}

                                  <TableCell>{detalle.estado}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalRows}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Filas por página:"
        rowsPerPageOptions={[10, 20, 30]}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Paper>
  );
}
