import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Switch,
  useTheme,
  Chip,
  Divider,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import {
  CursoConcepto,
  CursoListado,
  TipoConcepto,
} from "../types/cursos.types";
import { cardCursoStyle, cardActionsRow } from "../styles/cursos.styles";

interface Props {
  curso: CursoListado;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActivo?: (checked: boolean) => void;
}

export function CursoCard({ curso, onEdit, onDelete, onToggleActivo }: Props) {
  const theme = useTheme();

  const safeNumber = (val: any) =>
    val !== undefined && val !== null && val !== "" && !isNaN(Number(val))
      ? Number(val).toLocaleString("es-PY")
      : "0";

  const formatearMonto = (val: any) => `Gs. ${safeNumber(val)}`;

  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return "—";

    const soloFecha = (fecha.includes("T") ? fecha.split("T")[0] : fecha) ?? "";
    if (!soloFecha) return "—";

    const partes = soloFecha.split("-");
    if (partes.length === 3) {
      const [anio, mes, dia] = partes;
      return `${dia}/${mes}/${anio}`;
    }

    return soloFecha;
  };

  const obtenerConcepto = (tipo: TipoConcepto): CursoConcepto | undefined =>
    curso.conceptos?.find((c) => c.tipoConcepto === tipo);

  const contarPagosActivos = (concepto?: CursoConcepto) =>
    (concepto?.vencimientos ?? []).filter((v) => v.activo).length;

  const sumarMontos = (concepto?: CursoConcepto) =>
    (concepto?.vencimientos ?? []).reduce(
      (acc, item) => acc + Number(item.monto ?? 0),
      0,
    );

  const obtenerPrimerVencimiento = (concepto?: CursoConcepto) => {
    const vencimientos = (concepto?.vencimientos ?? [])
      .filter((v) => v.activo && v.fechaVencimiento)
      .sort(
        (a, b) =>
          new Date(a.fechaVencimiento).getTime() -
          new Date(b.fechaVencimiento).getTime(),
      );

    return vencimientos[0];
  };

  const matricula = obtenerConcepto("Matricula");
  const cuotas = obtenerConcepto("Cuota");
  const practicas = obtenerConcepto("Practica");
  const derechoExamen = obtenerConcepto("DerechoExamen");

  const renderResumenConcepto = (
    titulo: string,
    concepto?: CursoConcepto,
    color: string = "#6c63ff",
  ) => {
    if (!concepto) return null;

    const cantidadPagos = contarPagosActivos(concepto);
    const total = sumarMontos(concepto);
    const primerPago = obtenerPrimerVencimiento(concepto);

    return (
      <Box
        sx={{
          border: "1px solid #ececec",
          borderRadius: 3,
          p: 1.6,
          backgroundColor: "#fcfcfd",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          minHeight: 150,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mb: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              fontSize: "0.98rem",
              color: "#222",
            }}
          >
            {titulo}
          </Typography>

          <Chip
            size="small"
            label={`${cantidadPagos} ${cantidadPagos === 1 ? "pago" : "pagos"}`}
            sx={{
              borderColor: color,
              color,
              fontWeight: 700,
              backgroundColor: "#fff",
            }}
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body2" sx={{ color: "#666" }}>
            {concepto.descripcion || titulo}
          </Typography>

          <Typography variant="body2">
            <b>Total:</b> {formatearMonto(total)}
          </Typography>

          <Typography variant="body2">
            <b>Primer pago:</b> {formatearFecha(primerPago?.fechaVencimiento)}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        ...cardCursoStyle,
        borderRadius: 10,
        width: "100%",
        maxWidth: { xs: "100%", sm: 430 },
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
        mx: "auto",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <SchoolOutlinedIcon sx={{ fontSize: 26, mr: 1, color: "#4a60ff" }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: 19,
              lineHeight: 1.2,
              overflowWrap: "break-word",
            }}
          >
            {curso.nombre}
          </Typography>
        </Box>

        <Typography
          sx={{
            mb: 2,
            fontSize: 15,
            color: "#9734de",
            overflowWrap: "break-word",
          }}
        >
          {curso.descripcion}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <b>Duración:</b> {safeNumber(curso.duracion)} {curso.unidadDuracion}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 1.2,
            mb: 2,
          }}
        >
          {renderResumenConcepto("Matrícula", matricula, "#ef6c00")}
          {renderResumenConcepto("Cuotas", cuotas, "#7b1fa2")}
          {renderResumenConcepto("Prácticas", practicas, "#2e7d32")}
          {renderResumenConcepto("Derecho examen", derechoExamen, "#1976d2")}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.7,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <EventOutlinedIcon sx={{ fontSize: 16, color: "#6a737d" }} />
              <Typography variant="body2">
                <b>Inicio:</b> {formatearFecha(curso.fechaInicio)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <EventOutlinedIcon sx={{ fontSize: 16, color: "#d32f2f" }} />
              <Typography variant="body2">
                <b>Fin:</b> {formatearFecha(curso.fechaFin)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              width: { xs: "100%", sm: "auto" },
              minWidth: 0,
            }}
          >
            <Switch
              checked={curso.activo}
              onChange={(e) =>
                onToggleActivo && onToggleActivo(e.target.checked)
              }
              color="success"
              inputProps={{ "aria-label": "Activar/Desactivar curso" }}
              sx={{
                mr: 0.5,
                "& .MuiSwitch-switchBase.Mui-checked": { color: green[600] },
                "& .MuiSwitch-switchBase": { color: grey[400] },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: curso.activo ? green[700] : grey[600],
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              {curso.activo ? (
                <>
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 16, mr: 0.5, color: green[600] }}
                  />
                  Activo
                </>
              ) : (
                <>
                  <HighlightOffOutlinedIcon
                    sx={{ fontSize: 16, mr: 0.5, color: grey[500] }}
                  />
                  Inactivo
                </>
              )}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            ...cardActionsRow,
            display: "flex",
            justifyContent: "center",
            gap: 1.5,
            flexWrap: "wrap",
            mt: "auto",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditOutlinedIcon />}
            onClick={onEdit}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              backgroundColor: "#6377e9",
              color: "#fff",
              border: "none",
              minWidth: 120,
              ":hover": { backgroundColor: "#4a60ff" },
            }}
          >
            Editar
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={onDelete}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              backgroundColor: "#e96565",
              color: "#fff",
              border: "none",
              minWidth: 120,
              ":hover": { backgroundColor: "#d32f2f" },
            }}
          >
            Eliminar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
