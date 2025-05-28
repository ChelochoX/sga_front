import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { Curso } from "../types/cursos.types";
import { cardCursoStyle, cardActionsRow } from "../styles/cursos.styles";

interface Props {
  curso: Curso;
  onEdit: () => void;
  onDelete: () => void;
}

// Un pequeño helper visual para destacar montos
const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      background: "rgba(76, 175, 80, 0.10)", // Verde muy suave, puedes probar azul claro o naranja suave
      color: "#357a38",
      padding: "2px 10px",
      borderRadius: 8,
      fontWeight: 600,
      marginLeft: 6,
      marginRight: 6,
      display: "inline-block",
      minWidth: "50px",
      textAlign: "center",
    }}
  >
    {children}
  </span>
);

export function CursoCard({ curso, onEdit, onDelete }: Props) {
  // Helper para números
  const safeNumber = (val: any) =>
    val !== undefined && val !== null && val !== "" && !isNaN(Number(val))
      ? Number(val).toLocaleString()
      : "—";

  return (
    <Card sx={cardCursoStyle}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 1, display: "flex", alignItems: "center" }}
        >
          <SchoolOutlinedIcon sx={{ fontSize: 28, mr: 1, color: "#4a60ff" }} />
          {curso.nombre}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {curso.descripcion}
        </Typography>
        <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
          <Typography variant="body2">
            <b>Duración:</b> {safeNumber(curso.duracion)}{" "}
            {curso.unidad_duracion}
          </Typography>
        </Box>
        <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
          <Typography variant="body2">
            <b>Cuotas:</b> {safeNumber(curso.cantidad_cuota)}
          </Typography>
        </Box>
        <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <PaymentsOutlinedIcon sx={{ fontSize: 18, color: "#5471f7" }} />
          <Typography variant="body2">
            <b>Monto Cuota:</b>
            {Number(curso.monto_cuota) > 0 ? (
              <Highlight>{safeNumber(curso.monto_cuota)}</Highlight>
            ) : (
              <span style={{ marginLeft: 8 }}>—</span>
            )}
          </Typography>
        </Box>
        <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">
            <b>Práctica:</b> {curso.tiene_practica ? "Sí" : "No"}
            <span style={{ marginLeft: 8 }}>
              <b>Costo Práctica:</b>
            </span>
            {Number(curso.costo_practica) > 0 ? (
              <Highlight>{safeNumber(curso.costo_practica)}</Highlight>
            ) : (
              <span style={{ marginLeft: 8 }}>—</span>
            )}
          </Typography>
        </Box>
        <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <EventOutlinedIcon sx={{ fontSize: 18, color: "#5471f7" }} />
          <Typography variant="body2">
            <b>Inicio:</b> {curso.fecha_inicio}
            <span style={{ marginLeft: 12 }}>
              <b>Fin:</b> {curso.fecha_fin}
            </span>
          </Typography>
        </Box>
        <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">
            <b>Matrícula:</b>
            {Number(curso.monto_matricula) > 0 ? (
              <Highlight>{safeNumber(curso.monto_matricula)}</Highlight>
            ) : (
              <span style={{ marginLeft: 8 }}>—</span>
            )}
          </Typography>
        </Box>
        <Box sx={cardActionsRow}>
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
