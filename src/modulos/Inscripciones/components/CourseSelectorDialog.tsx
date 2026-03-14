import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Curso } from "../types/inscripciones.types";
import { useInscripciones } from "../hooks/useInscripciones";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (curso: Curso) => void;
}

export default function CourseSelectorDialog({
  open,
  onClose,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const { cursos, loading, refetchCursos } = useInscripciones();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const didInitialFetch = useRef(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      refetchCursos("");
      didInitialFetch.current = true;
    } else {
      didInitialFetch.current = false;
    }
  }, [open, refetchCursos]);

  useEffect(() => {
    if (open && didInitialFetch.current) {
      refetchCursos(query);
    }
  }, [open, query, refetchCursos]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          maxHeight: { xs: "100dvh", sm: "85dvh" },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Seleccionar curso</DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        <TextField
          label="Buscar curso"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : cursos.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No se encontraron cursos.
          </Typography>
        ) : (
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <List disablePadding>
              {cursos.map((c, index) => (
                <ListItemButton
                  key={c.idCurso}
                  onClick={() => {
                    onSelect(c);
                    onClose();
                  }}
                  divider={index < cursos.length - 1}
                  sx={{ py: 1.5 }}
                >
                  <Box sx={{ mr: 2, color: "#5947f5", display: "flex" }}>
                    <MenuBookIcon fontSize="small" />
                  </Box>
                  <ListItemText
                    primary={c.nombre}
                    secondary={c.descripcion || "Sin descripción"}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="secondary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
