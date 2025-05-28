// src/modulos/Cursos/styles/cursos.styles.ts
import { SxProps, Theme } from "@mui/material";

export const cardCursoStyle: SxProps<Theme> = {
  minWidth: 350,
  maxWidth: 450,
  margin: 2,
  borderRadius: 3,
  boxShadow: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "#f9f9fe",
  transition: "0.2s",
  "&:hover": {
    boxShadow: 10,
    backgroundColor: "#f0f4ff",
  },
};

export const cardActionsRow: SxProps<Theme> = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 2,
  marginTop: 2,
};

export const gridCursosStyle: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 24,
  justifyContent: "center",
};
