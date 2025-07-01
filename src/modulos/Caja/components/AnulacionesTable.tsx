import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
  Divider,
  Box,
} from "@mui/material";
import { CajaAnulacionDto } from "../types/caja.types";

interface Props {
  anulaciones: CajaAnulacionDto[];
}

const formatFecha = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function AnulacionesTable({ anulaciones }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (anulaciones.length === 0) {
    return <Typography>No hay anulaciones registradas.</Typography>;
  }

  return isMobile ? (
    <Stack spacing={2}>
      {anulaciones.map((a) => (
        <Card key={a.idAnulacion} variant="outlined">
          <CardContent>
            <Typography variant="body2" gutterBottom>
              <strong>Fecha:</strong> {formatFecha(a.fechaAnulacion)}
            </Typography>
            <Typography variant="body2">
              <strong>Movimiento:</strong> {a.idMovimiento}
            </Typography>
            <Typography variant="body2">
              <strong>Motivo:</strong> {a.motivo}
            </Typography>
            <Typography variant="body2">
              <strong>Usuario:</strong> {a.usuarioAnulacion}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  ) : (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Movimiento</TableCell>
            <TableCell>Motivo</TableCell>
            <TableCell>Usuario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {anulaciones.map((a) => (
            <TableRow key={a.idAnulacion}>
              <TableCell>{formatFecha(a.fechaAnulacion)}</TableCell>
              <TableCell>{a.idMovimiento}</TableCell>
              <TableCell>{a.motivo}</TableCell>
              <TableCell>{a.usuarioAnulacion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
