import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InscripcionesTable from "../components/InscripcionesTable";
import InscripcionForm from "../components/InscripcionForm";

export default function InscripcionesPage() {
  const [open, setOpen] = useState(false);

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Inscripciones</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Nueva
        </Button>
      </Stack>

      <InscripcionesTable data={[]} />

      <InscripcionForm open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
