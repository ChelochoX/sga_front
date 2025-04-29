// src/utils/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6a11cb",
    },
    secondary: {
      main: "#2575fc",
    },
    background: {
      default: "#f3f3f3",
    },
  },
  typography: {
    fontFamily: ["Poppins", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
  },
});

export default theme;
