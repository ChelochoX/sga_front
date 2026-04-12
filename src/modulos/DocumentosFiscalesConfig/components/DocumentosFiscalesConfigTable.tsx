import React from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Typography,
  Box,
  Card,
  CardContent,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DocumentoFiscalConfig } from "../types/documentosFiscalesConfig.types";

interface Props {
  data: DocumentoFiscalConfig[];
  onEdit: (item: DocumentoFiscalConfig) => void;
  onDelete: (id: number) => void;
}

const formatearFecha = (fecha?: string | null) => {
  if (!fecha) return "—";

  const soloFecha = fecha.includes("T") ? fecha.split("T")[0] : fecha;

  if (!soloFecha) return "—";

  const partes = soloFecha.split("-");
  if (partes.length === 3) {
    const [anio, mes, dia] = partes;
    return `${dia}/${mes}/${anio}`;
  }

  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("es-PY");
};

export default function DocumentosFiscalesConfigTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {data.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No hay configuraciones registradas.
          </Typography>
        ) : (
          data.map((item) => (
            <Card
              key={item.id}
              sx={{
                borderRadius: 3,
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent>
                <Typography fontWeight={700} fontSize="1.2rem" mb={1}>
                  {item.tipoDocumento}
                </Typography>

                <Typography variant="body2">
                  Concepto: {item.conceptoDocumento}
                </Typography>
                <Typography variant="body2">
                  Sucursal: {item.sucursal} - Punto: {item.puntoExpedicion}
                </Typography>
                <Typography variant="body2">
                  Timbrado: {item.timbrado}
                </Typography>
                <Typography variant="body2">
                  Números: {item.numeroActual} / {item.numeroInicio} -{" "}
                  {item.numeroFin}
                </Typography>
                <Typography variant="body2">
                  Vigencia: {formatearFecha(item.vigenciaDesde)} al{" "}
                  {formatearFecha(item.vigenciaHasta)}
                </Typography>
                <Typography variant="body2">
                  Emisor: {item.razonSocialEmisor}
                </Typography>

                <Stack direction="row" spacing={1} mt={2} alignItems="center">
                  <Chip
                    label={item.activo ? "Activo" : "Inactivo"}
                    color={item.activo ? "success" : "default"}
                    size="small"
                  />
                  <IconButton color="primary" onClick={() => onEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
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
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#faf7ff",
            }}
          >
            <TableCell sx={{ fontWeight: 700 }}>Tipo documento</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Concepto</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Sucursal</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Punto</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Timbrado</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Número actual</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Rango</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Vigencia</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center">
                No hay configuraciones registradas.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "#fafafa",
                  },
                }}
              >
                <TableCell>{item.tipoDocumento}</TableCell>
                <TableCell>{item.conceptoDocumento}</TableCell>
                <TableCell>{item.sucursal}</TableCell>
                <TableCell>{item.puntoExpedicion}</TableCell>
                <TableCell>{item.timbrado}</TableCell>
                <TableCell>{item.numeroActual}</TableCell>
                <TableCell>
                  {item.numeroInicio} - {item.numeroFin}
                </TableCell>
                <TableCell>
                  {formatearFecha(item.vigenciaDesde)} al{" "}
                  {formatearFecha(item.vigenciaHasta)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.activo ? "Activo" : "Inactivo"}
                    color={item.activo ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => onEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => onDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
