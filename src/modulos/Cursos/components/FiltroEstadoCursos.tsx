import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface FiltroEstadoCursosProps {
  estado: string;
  setEstado: React.Dispatch<React.SetStateAction<string>>;
}

const FiltroEstadoCursos: React.FC<FiltroEstadoCursosProps> = ({
  estado,
  setEstado,
}) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="estado-curso-label">Estado</InputLabel>
      <Select
        labelId="estado-curso-label"
        value={estado}
        label="Estado"
        onChange={(e) => setEstado(e.target.value)}
      >
        <MenuItem value="">Todos</MenuItem>
        <MenuItem value="true">Activos</MenuItem>
        <MenuItem value="false">Inactivos</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FiltroEstadoCursos;
