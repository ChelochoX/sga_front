// src/utils/theme.ts
import { createTheme } from "@mui/material/styles";
import { esES as dataGridEsES } from "@mui/x-data-grid/locales";

const theme = createTheme(
  {
    palette: {
      mode: "light",
      primary: {
        main: "#6a11cb",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#2575fc",
        contrastText: "#ffffff",
      },
      error: {
        main: "#d32f2f",
        contrastText: "#ffffff",
      },
      background: {
        default: "#f3f3f3",
        paper: "#ffffff",
      },
      text: {
        primary: "#1a1a1a",
        secondary: "#6a11cb",
      },
    },
    typography: {
      fontFamily: [
        "Poppins",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ].join(","),
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            color: "#fff",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#f4f6f8",
            color: "#1a1a1a",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "30px",
            fontWeight: 600,
            textTransform: "none",
          },
          containedPrimary: {
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          },
          containedError: {
            backgroundColor: "#d32f2f",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          },
        },
      },
    },
  },
  dataGridEsES,
);

export default theme;
