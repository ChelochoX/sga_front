import React from "react";
import { Dialog, DialogTitle } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PermisosForm: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Asignar / Editar Permisos</DialogTitle>
      {/* Aquí añadirás campos cuando implementes la edición */}
    </Dialog>
  );
};

export default PermisosForm;
