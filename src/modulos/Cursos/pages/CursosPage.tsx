import { useCursos } from "../hooks/useCursos";
import { CursoCard } from "../components/CursoCard";

export default function CursosPage() {
  const { cursos, loading } = useCursos();

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {cursos.map((curso) => (
        <CursoCard
          key={curso.id_curso}
          curso={curso}
          onEdit={() => {
            /* Lógica para editar */
          }}
          onDelete={() => {
            /* Lógica para eliminar */
          }}
        />
      ))}
    </div>
  );
}
