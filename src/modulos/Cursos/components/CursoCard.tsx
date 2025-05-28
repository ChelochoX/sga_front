import { Card, CardContent, Typography, Button } from "@mui/material";
import { Curso } from "../types/cursos.types";

interface Props {
  curso: Curso;
  onEdit: () => void;
  onDelete: () => void;
}

export function CursoCard({ curso, onEdit, onDelete }: Props) {
  return (
    <Card sx={{ minWidth: 275, margin: 2 }}>
      <CardContent>
        <Typography variant="h6">{curso.nombre}</Typography>
        <Typography color="text.secondary">{curso.descripcion}</Typography>
        <Typography variant="body2">
          Duración: {curso.duracion} {curso.unidad_duracion}
        </Typography>
        {/* Otros campos que quieras mostrar */}
        <Button onClick={onEdit}>Editar</Button>
        <Button onClick={onDelete} color="error">
          Eliminar
        </Button>
      </CardContent>
    </Card>
  );
}
