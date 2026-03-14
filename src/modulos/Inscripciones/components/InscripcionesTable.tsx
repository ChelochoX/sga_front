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
  Grid,
  useMediaQuery,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventIcon from "@mui/icons-material/Event";
import { InscripcionDetalle } from "../types/inscripciones.types";

interface Props {
  data: InscripcionDetalle[];
  onDelete: (id: number) => void;
  loadingDelete: boolean;
}

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
                      {new Date(row.fechaInscripcion).toLocaleDateString(
                        "es-PY",
                      )}
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

                  <Typography variant="body2" color="text.secondary">
                    Matrícula: {row.montoDescMatricula} / Práctica:{" "}
                    {row.montoDescPractica} / Descuento: {row.montoDescuento}
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
      sx={{ maxHeight: 420, borderRadius: 2, overflow: "hidden" }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Estudiante</TableCell>
            <TableCell>Curso</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Descuentos</TableCell>
            <TableCell align="center">Acción</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
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
                <TableCell>
                  {new Date(row.fechaInscripcion).toLocaleDateString("es-PY")}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.estado}
                    size="small"
                    color={row.estado === "Activa" ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  Matrícula: {row.montoDescMatricula} / Práctica:{" "}
                  {row.montoDescPractica} / Descuento: {row.montoDescuento}
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
