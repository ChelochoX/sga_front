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
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { CajaAnulacionDto } from "../types/caja.types";

interface Props {
  anulaciones: CajaAnulacionDto[];
  onImprimir: (idAnulacion: number) => void;
}

const formatFecha = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function AnulacionesTable({ anulaciones, onImprimir }: Props) {
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

            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Tooltip title="Imprimir factura anulada">
                <IconButton
                  sx={{ color: "#7c3aed" }}
                  onClick={() => onImprimir(a.idAnulacion)}
                >
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            </Box>
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
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {anulaciones.map((a) => (
            <TableRow key={a.idAnulacion}>
              <TableCell>{formatFecha(a.fechaAnulacion)}</TableCell>
              <TableCell>{a.idMovimiento}</TableCell>
              <TableCell>{a.motivo}</TableCell>
              <TableCell>{a.usuarioAnulacion}</TableCell>
              <TableCell align="center">
                <Tooltip title="Imprimir factura anulada">
                  <IconButton
                    sx={{ color: "#7c3aed" }}
                    onClick={() => onImprimir(a.idAnulacion)}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
