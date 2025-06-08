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
  Grid,
  Collapse,
  IconButton,
  Checkbox,
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

  // Estado para manejar apertura/cierre de filas de detalles
  const [open, setOpen] = React.useState<number | null>(null);

  // Manejo de checks
  const handleCheck = (id: number) => {
    if (!onSeleccionarDetalle) return;
    if (seleccionados.includes(id)) {
      onSeleccionarDetalle(seleccionados.filter((i) => i !== id));
    } else {
      onSeleccionarDetalle([...seleccionados, id]);
    }
  };

  // --- VISTA MOBILE COMO CARDS ---
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
          data.map((cab, idx) => (
            <Card key={cab.idPago} elevation={2}>
              <CardContent>
                <Typography fontWeight={600}>
                  {cab.nombreEstudiante} - {cab.nombreCurso}
                </Typography>
                <Typography variant="body2">
                  Deuda Total:{" "}
                  {cab.deudaTotal?.toLocaleString("es-PY", {
                    style: "currency",
                    currency: "PYG",
                  })}
                </Typography>
                <Typography variant="body2">
                  Tipo Cuenta: {cab.tipoCuenta} | Descuento:{" "}
                  {cab.descuentoCabecera}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {cab.observacion}
                </Typography>
                <Box mt={2}>
                  <Typography fontWeight={600} fontSize={15} mb={1}>
                    Detalles de cuotas
                  </Typography>
                  {cab.detalles.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Sin cuotas
                    </Typography>
                  ) : (
                    cab.detalles.map((det, dIdx) => (
                      <Box
                        key={dIdx}
                        mb={1}
                        p={1}
                        bgcolor="#f3f0ff"
                        borderRadius={2}
                      >
                        <Typography fontWeight={500}>{det.concepto}</Typography>
                        <Typography variant="body2">
                          Monto:{" "}
                          {det.monto?.toLocaleString("es-PY", {
                            style: "currency",
                            currency: "PYG",
                          })}
                        </Typography>
                        <Typography variant="body2">
                          Vencimiento:{" "}
                          {det.fechaVencimiento
                            ? new Date(det.fechaVencimiento).toLocaleDateString(
                                "es-PY"
                              )
                            : "-"}
                        </Typography>
                        {tab === "realizados" && (
                          <>
                            <Typography variant="body2">
                              Pago:{" "}
                              {det.fechaPago
                                ? new Date(det.fechaPago).toLocaleDateString(
                                    "es-PY"
                                  )
                                : "-"}
                            </Typography>
                            <Typography variant="body2">
                              Tipo Pago: {det.tipoPago || "-"}
                            </Typography>
                            <Typography variant="body2">
                              Referencia: {det.referencia || "-"}
                            </Typography>
                            <Typography variant="body2">
                              Voucher: {det.voucherNumero || "-"}
                            </Typography>
                          </>
                        )}
                        <Typography variant="body2">
                          Estado: {det.estado}
                        </Typography>
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

  // --- VISTA DESKTOP: TABLE AGRUPADA ---
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
                  {/* Cabecera */}
                  <TableRow
                    sx={{
                      background: "#faf9ff",
                      fontWeight: 700,
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
                    <TableCell>
                      {cabecera.deudaTotal?.toLocaleString("es-PY", {
                        style: "currency",
                        currency: "PYG",
                      })}
                    </TableCell>
                    <TableCell>{cabecera.tipoCuenta}</TableCell>
                    <TableCell>{cabecera.descuentoCabecera}</TableCell>
                    <TableCell>{cabecera.observacion}</TableCell>
                  </TableRow>
                  {/* Detalle expandible */}
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0, background: "#f9f7fd" }}>
                      <Collapse in={open === idx} timeout="auto" unmountOnExit>
                        <Box m={2} mb={3}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            gutterBottom
                            sx={{ mb: 1.5, color: "#7c3aed" }}
                          >
                            Detalles de cuotas
                          </Typography>
                          <Table size="small" sx={{ background: "#fff" }}>
                            <TableHead>
                              <TableRow>
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
                                  <TableCell>{detalle.concepto}</TableCell>
                                  <TableCell>
                                    {detalle.monto?.toLocaleString("es-PY", {
                                      style: "currency",
                                      currency: "PYG",
                                    })}
                                  </TableCell>
                                  <TableCell>
                                    {detalle.fechaVencimiento
                                      ? new Date(
                                          detalle.fechaVencimiento
                                        ).toLocaleDateString("es-PY")
                                      : "-"}
                                  </TableCell>
                                  {tab === "realizados" && (
                                    <>
                                      <TableCell>
                                        {detalle.fechaPago
                                          ? new Date(
                                              detalle.fechaPago
                                            ).toLocaleDateString("es-PY")
                                          : "-"}
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
