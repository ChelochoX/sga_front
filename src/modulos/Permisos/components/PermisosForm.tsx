import React from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { Entidad, Recurso, Permiso } from "../types/permisos.types";

interface Props {
  entidades: Entidad[];
  recursos: Recurso[];
  permisos: Permiso[];
}

const PermisosForm: React.FC<Props> = ({ entidades, recursos, permisos }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        {/* Entidades */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Entidades</Typography>
          {entidades.map((entidad) => (
            <FormControlLabel
              key={entidad.idEntidad}
              control={<Checkbox />}
              label={entidad.nombreEntidad}
            />
          ))}
        </Grid>

        {/* Recursos */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Recursos</Typography>
          {recursos.map((recurso) => (
            <FormControlLabel
              key={recurso.idRecurso}
              control={<Checkbox />}
              label={recurso.nombreRecurso}
            />
          ))}
        </Grid>

        {/* Permisos */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6">Permisos Asignados</Typography>
          {permisos.map((permiso) => (
            <FormControlLabel
              key={permiso.idPermiso}
              control={<Checkbox defaultChecked />}
              label={`Recurso ${permiso.idRecurso} - Entidad ${permiso.idEntidad}`}
            />
          ))}
        </Grid>
      </Grid>

      <Button variant="contained" sx={{ mt: 3 }} color="primary">
        Guardar Permisos
      </Button>
    </Box>
  );
};

export default PermisosForm;
