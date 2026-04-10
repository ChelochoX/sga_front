import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Switch,
  useTheme,
  Chip,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import { CursoListado } from "../types/cursos.types";
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
      ? Number(val).toLocaleString()
      : "—";

  return (
    <Card
      sx={{
        ...cardCursoStyle,
        borderRadius: 10,
        minHeight: 320,
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <b>Duración:</b> {safeNumber(curso.duracion)} {curso.unidadDuracion}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            {!!curso.montoMatricula && curso.montoMatricula > 0 && (
              <Chip
                size="small"
                label={`Matrícula: ${safeNumber(curso.montoMatricula)}`}
                color="warning"
                variant="outlined"
              />
            )}

            {!!curso.cantidadCuota && curso.cantidadCuota > 0 && (
              <Chip
                size="small"
                label={`Cuotas: ${safeNumber(curso.cantidadCuota)}`}
                color="primary"
                variant="outlined"
              />
            )}

            {!!curso.tienePractica && (
              <Chip
                size="small"
                label={`Práctica: ${safeNumber(curso.costoPractica ?? 0)}`}
                color="success"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            minWidth: 110,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
            mt: "auto",
            [theme.breakpoints.down("sm")]: {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              mt: 2,
              gap: 2,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", sm: "flex-end" },
              gap: 0.3,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventOutlinedIcon
                sx={{ fontSize: 16, color: "#6a737d", mr: 0.5 }}
              />
              <Typography variant="body2">
                <b>Inicio:</b> {curso.fechaInicio}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventOutlinedIcon
                sx={{ fontSize: 16, color: "#d32f2f", mr: 0.5 }}
              />
              <Typography variant="body2">
                <b>Fin:</b> {curso.fechaFin}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
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
