// src/components/Sidebar/Sidebar.styles.ts
import { Theme } from "@mui/material/styles";

export const drawerWidth = 240;
export const collapsedDrawerWidth = 60;

export const drawerStyles = {
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #f8cdda, #1d2b64)",
    color: "#fff", // Texto blanco para contraste
    borderRight: "none", // opcional: sin borde
  },
};

export const activeLinkStyle = (theme: Theme) => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  "& .MuiListItemIcon-root": {
    color: "#fff",
  },
});
