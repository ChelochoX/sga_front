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
import SchoolIcon from "@mui/icons-material/School";
import { Estudiante } from "../types/inscripciones.types";
import { useInscripciones } from "../hooks/useInscripciones";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (e: Estudiante) => void;
}

export default function StudentSelectorDialog({
  open,
  onClose,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const { estudiantes, loading, refetchEstudiantes } = useInscripciones();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const didInitialFetch = useRef(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      refetchEstudiantes("");
      didInitialFetch.current = true;
    } else {
      didInitialFetch.current = false;
    }
  }, [open, refetchEstudiantes]);

  useEffect(() => {
    if (open && didInitialFetch.current) {
      refetchEstudiantes(query);
    }
  }, [open, query, refetchEstudiantes]);

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
      <DialogTitle sx={{ fontWeight: 700 }}>Seleccionar estudiante</DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        <TextField
          label="Buscar estudiante"
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
        ) : estudiantes.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No se encontraron estudiantes.
          </Typography>
        ) : (
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <List disablePadding>
              {estudiantes.map((s, index) => (
                <ListItemButton
                  key={s.idPersona}
                  onClick={() => {
                    onSelect(s);
                    onClose();
                  }}
                  divider={index < estudiantes.length - 1}
                  sx={{ py: 1.5 }}
                >
                  <Box sx={{ mr: 2, color: "#5947f5", display: "flex" }}>
                    <SchoolIcon fontSize="small" />
                  </Box>
                  <ListItemText
                    primary={`${s.nombres} ${s.apellidos}`}
                    secondary={`ID Persona: ${s.idPersona}`}
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
