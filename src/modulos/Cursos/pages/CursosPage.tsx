import { useCursos } from "../hooks/useCursos";
import { CursoCard } from "../components/CursoCard";
import { Curso } from "../types/cursos.types";
import { gridCursosStyle } from "../styles/cursos.styles";
import * as cursosService from "../../../api/cursosService";

export default function CursosPage() {
  const { cursos, setCursos, loading, fetchCursos } = useCursos();

  // Manejo optimista
  const handleToggleActivo = async (curso: Curso, activo: boolean) => {
    // 1. Actualiza solo ese curso en el front
    setCursos((prev) =>
      prev.map((c) => (c.id_curso === curso.id_curso ? { ...c, activo } : c))
    );
    try {
      await cursosService.cambiarEstadoCurso(curso.id_curso, activo);
      // Si querés, podés refrescar todo después:
      // await fetchCursos();
    } catch (e) {
      // Si falla, revertimos el cambio
      setCursos((prev) =>
        prev.map((c) =>
          c.id_curso === curso.id_curso ? { ...c, activo: !activo } : c
        )
      );
      alert("No se pudo cambiar el estado del curso.");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={gridCursosStyle as React.CSSProperties}>
      {cursos.map((curso) => (
        <CursoCard
          key={curso.id_curso}
          curso={curso}
          onEdit={() => {
            /* ... */
          }}
          onDelete={() => {
            /* ... */
          }}
          onToggleActivo={(checked) => handleToggleActivo(curso, checked)}
        />
      ))}
    </div>
  );
}
