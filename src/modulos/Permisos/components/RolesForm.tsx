import React from "react";
import { Dialog, DialogTitle } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RolesForm: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Asignar / Editar Roles (feature próximo)</DialogTitle>
      {/* Aquí añadirás campos cuando implementes edición */}
    </Dialog>
  );
};

export default RolesForm;
