// src/modulos/Permisos/components/RolesForm.tsx

import React from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
} from "@mui/material";
import { Rol } from "../types/roles.types";

interface Props {
  roles: Rol[];
  selectedRoles: number[];
  onChange: (roleId: number) => void;
  onSave: () => void;
  disabled?: boolean;
}

const RolesForm: React.FC<Props> = ({
  roles,
  selectedRoles,
  onChange,
  onSave,
  disabled = false,
}) => {
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Roles Disponibles
      </Typography>

      <Grid container spacing={2}>
        {roles.map((rol) => (
          <Grid item xs={12} md={6} key={rol.idRol}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedRoles.includes(rol.idRol)}
                  onChange={() => onChange(rol.idRol)}
                />
              }
              label={rol.nombreRol}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={onSave}
        sx={{ mt: 3 }}
        disabled={disabled}
      >
        Guardar Roles
      </Button>
    </Box>
  );
};

export default RolesForm;
