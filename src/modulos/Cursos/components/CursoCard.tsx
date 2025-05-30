import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Switch,
  useTheme,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { Curso } from "../types/cursos.types";
import { cardCursoStyle, cardActionsRow } from "../styles/cursos.styles";

interface Props {
  curso: Curso;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActivo?: (checked: boolean) => void;
}

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      background: "rgba(76, 175, 80, 0.12)",
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

export function CursoCard({ curso, onEdit, onDelete, onToggleActivo }: Props) {
  const theme = useTheme();
  const safeNumber = (val: any) =>
    val !== undefined && val !== null && val !== "" && !isNaN(Number(val))
      ? Number(val).toLocaleString()
      : "—";

  return (
    <Card
      sx={{
        ...cardCursoStyle,
        borderRadius: 10,
        minHeight: 360,
        maxWidth: 380,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: { xs: 2, md: 3 },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <SchoolOutlinedIcon sx={{ fontSize: 26, mr: 1, color: "#4a60ff" }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: 19,
              lineHeight: 1.18,
              maxWidth: "85%",
              overflowWrap: "break-word",
            }}
          >
            {curso.nombre}
          </Typography>
        </Box>
        {/* Descripción */}
        <Typography
          color="primary"
          sx={{
            mb: 2,
            fontSize: 15,
            color: "#9734de",
            maxWidth: "100%",
            overflowWrap: "break-word",
            minHeight: 30,
          }}
        >
          {curso.descripcion}
        </Typography>
        {/* Info principal */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 155, maxWidth: 210 }}>
            <Typography variant="body2" sx={{ mb: 0.3 }}>
              <b>Duración:</b> {safeNumber(curso.duracion)}{" "}
              {curso.unidad_duracion}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.3 }}>
              <b>Cuotas:</b> {safeNumber(curso.cantidad_cuota)}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <PaymentsOutlinedIcon
                sx={{ fontSize: 17, color: "#5471f7", mr: 1 }}
              />
              <Typography variant="body2">
                <b>Monto Cuota:</b>
                {Number(curso.monto_cuota) > 0 ? (
                  <Highlight>{safeNumber(curso.monto_cuota)}</Highlight>
                ) : (
                  <span style={{ marginLeft: 8 }}>—</span>
                )}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <AssignmentTurnedInOutlinedIcon
                sx={{ fontSize: 17, color: "#4caf50", mr: 1 }}
              />
              <Box>
                <Typography variant="body2">
                  <b>Práctica:</b> {curso.tiene_practica ? "Sí" : "No"}
                </Typography>
                <Typography variant="body2" sx={{ ml: 0, mt: 0.2 }}>
                  <span style={{ fontWeight: 600 }}>Costo Práctica:</span>
                  {Number(curso.costo_practica) > 0 ? (
                    <Highlight>{safeNumber(curso.costo_practica)}</Highlight>
                  ) : (
                    <span style={{ marginLeft: 8 }}>—</span>
                  )}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CreditCardOutlinedIcon
                sx={{ fontSize: 18, color: "#ff9800", mr: 1 }}
              />
              <Typography variant="body2">
                <b>Matrícula:</b>
                {Number(curso.monto_matricula) > 0 ? (
                  <Highlight>{safeNumber(curso.monto_matricula)}</Highlight>
                ) : (
                  <span style={{ marginLeft: 8 }}>—</span>
                )}
              </Typography>
            </Box>
          </Box>
          {/* Fechas y estado */}
          <Box
            sx={{
              minWidth: 110,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 1,
              mt: { xs: 2, sm: 0 },
              // --- Responsive style: row on xs, column on md+ ---
              [theme.breakpoints.down("sm")]: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                mt: 2,
                gap: 2,
              },
            }}
          >
            {/* Fechas */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", sm: "flex-end" },
                mr: { xs: 1, sm: 0 },
                mb: { xs: 0, sm: 0.3 },
                gap: 0.3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EventOutlinedIcon
                  sx={{ fontSize: 16, color: "#6a737d", mr: 0.5 }}
                />
                <Typography variant="body2">
                  <b>Inicio:</b> {curso.fecha_inicio}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EventOutlinedIcon
                  sx={{ fontSize: 16, color: "#d32f2f", mr: 0.5 }}
                />
                <Typography variant="body2">
                  <b>Fin:</b> {curso.fecha_fin}
                </Typography>
              </Box>
            </Box>
            {/* Switch */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: { xs: 2, sm: 0 },
                mt: { xs: 0, sm: 0.5 },
                minWidth: "80px",
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
                  "& .MuiSwitch-switchBase.Mui-checked": { color: green[600] },
                  "& .MuiSwitch-switchBase": { color: grey[400] },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: curso.activo ? green[700] : grey[600],
                  ml: 1,
                  display: "flex",
                  alignItems: "center",
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
        </Box>
        {/* Acciones */}
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
