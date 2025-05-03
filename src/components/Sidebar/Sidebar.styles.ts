// src/components/Sidebar/Sidebar.styles.ts
import { Theme } from "@mui/material/styles";

export const drawerWidth = 240;

export const drawerStyles = {
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
  },
};

export const activeLinkStyle = (theme: Theme) => ({
  backgroundColor: theme.palette.action.selected,
});
