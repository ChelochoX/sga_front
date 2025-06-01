import * as React from "react";
import { Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";

interface Props {
  fechaInicio: Date | null;
  setFechaInicio: (date: Date | null) => void;
  fechaFin: Date | null;
  setFechaFin: (date: Date | null) => void;
}

const FiltroFechaCursos: React.FC<Props> = ({
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DatePicker
          label="Fecha inicio"
          value={fechaInicio}
          onChange={(value, _ctx) => setFechaInicio(value as Date | null)}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              sx: { borderRadius: 2, fontSize: "0.98rem" },
            },
          }}
          format="dd/MM/yyyy"
        />
        <DatePicker
          label="Fecha fin"
          value={fechaFin}
          onChange={(value, _ctx) => setFechaFin(value as Date | null)}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              sx: { borderRadius: 2, fontSize: "0.98rem" },
            },
          }}
          format="dd/MM/yyyy"
        />
      </Box>
    </LocalizationProvider>
  );
};

export default FiltroFechaCursos;
