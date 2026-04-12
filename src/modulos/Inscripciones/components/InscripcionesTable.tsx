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
  Card,
  CardContent,
  useMediaQuery,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventIcon from "@mui/icons-material/Event";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { InscripcionDetalle } from "../types/inscripciones.types";

interface Props {
  data: InscripcionDetalle[];
  onDelete: (id: number) => void;
  loadingDelete: boolean;
}

const formatearMonto = (monto: number) =>
  `Gs. ${Number(monto || 0).toLocaleString("es-PY")}`;

const formatearFecha = (fecha: string) => {
  if (!fecha) return "—";
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-PY");
};

export default function InscripcionesTable({
  data,
  onDelete,
  loadingDelete,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {data.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            Sin registros todavía
          </Typography>
        ) : (
          data.map((row) => (
            <Card
              key={row.idInscripcion}
              elevation={2}
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardContent>
                <Stack spacing={1.2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <SchoolIcon fontSize="small" sx={{ color: "#5947f5" }} />
                    <Typography variant="body1" fontWeight={700}>
                      {row.nombreEstudiante}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <MenuBookIcon fontSize="small" sx={{ color: "#3b82f6" }} />
                    <Typography variant="body2">{row.nombreCurso}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <EventIcon fontSize="small" sx={{ color: "#6b7280" }} />
                    <Typography variant="body2">
                      {formatearFecha(row.fechaInscripcion)}
                    </Typography>
                  </Box>

                  <Box>
                    <Chip
                      label={row.estado}
                      size="small"
                      color={row.estado === "Activa" ? "success" : "default"}
                      variant="outlined"
                    />
                  </Box>

                  <Divider />

                  <Box display="flex" alignItems="center" gap={1}>
                    <ReceiptLongIcon
                      fontSize="small"
                      sx={{ color: "#ef6c00" }}
                    />
                    <Typography variant="body2">
                      <b>Pagos:</b> {row.cantidadPagos}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <PaymentsIcon fontSize="small" sx={{ color: "#2e7d32" }} />
                    <Typography variant="body2">
                      <b>Total:</b> {formatearMonto(row.totalPagos)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Desc. matrícula: {formatearMonto(row.montoDescMatricula)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Desc. práctica: {formatearMonto(row.montoDescPractica)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Desc. general: {formatearMonto(row.montoDescuento)}
                  </Typography>

                  <Box display="flex" justifyContent="flex-end">
                    <Tooltip title="Eliminar inscripción">
                      <IconButton
                        color="error"
                        onClick={() => onDelete(row.idInscripcion)}
                        disabled={loadingDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: 520, borderRadius: 2, overflow: "hidden" }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Estudiante</TableCell>
            <TableCell>Curso</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Pagos</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell>Descuentos</TableCell>
            <TableCell align="center">Acción</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body2" color="text.secondary">
                  Sin registros todavía
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.idInscripcion} hover>
                <TableCell>{row.nombreEstudiante}</TableCell>
                <TableCell>{row.nombreCurso}</TableCell>
                <TableCell>{formatearFecha(row.fechaInscripcion)}</TableCell>
                <TableCell>
                  <Chip
                    label={row.estado}
                    size="small"
                    color={row.estado === "Activa" ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">{row.cantidadPagos}</TableCell>
                <TableCell align="right">
                  {formatearMonto(row.totalPagos)}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  Mat.: {formatearMonto(row.montoDescMatricula)} / Prác.:{" "}
                  {formatearMonto(row.montoDescPractica)} / Gral.:{" "}
                  {formatearMonto(row.montoDescuento)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Eliminar inscripción">
                    <IconButton
                      color="error"
                      onClick={() => onDelete(row.idInscripcion)}
                      disabled={loadingDelete}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
