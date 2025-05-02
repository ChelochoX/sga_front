import { SxProps, Theme } from "@mui/material";

export const drawerStyles: SxProps<Theme> = {
  width: 240,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: 240,
    boxSizing: "border-box",
    backgroundColor: "#f4f6f8",
    borderRight: "1px solid #ddd",
  },
};

export const activeLinkStyle: React.CSSProperties = {
  backgroundColor: "#e0f7fa",
  color: "#0288d1",
  textDecoration: "none",
};
