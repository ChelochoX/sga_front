import { useCursos } from "../hooks/useCursos";
import { CursoCard } from "../components/CursoCard";
import { gridCursosStyle } from "../styles/cursos.styles";

export default function CursosPage() {
  const { cursos, loading } = useCursos();

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={gridCursosStyle as React.CSSProperties}>
      {cursos.map((curso) => (
        <CursoCard
          key={curso.id_curso ?? `${curso.nombre}-${curso.fecha_inicio}`}
          curso={curso}
          onEdit={() => {
            /* Mostrar formulario de edición */
          }}
          onDelete={() => {
            /* Confirmar y eliminar */
          }}
        />
      ))}
    </div>
  );
}
