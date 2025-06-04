import { useState, useCallback } from "react";
import { Estudiante, Curso } from "../types/inscripciones.types";
import { getEstudiantes, getCursos } from "../../../api/inscripcionesService";

export const useInscripciones = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEstudiantes = useCallback(
    async (qParam: string = "") => {
      setLoading(true);
      try {
        const data = await getEstudiantes(qParam.trim());
        setEstudiantes(data);
      } catch (error) {
        console.error("❌ Error al obtener estudiantes:", error);
      } finally {
        setLoading(false);
      }
    },
    [] // jamás cambia, solo se crea una vez
  );

  const fetchCursos = useCallback(async (qParam: string = "") => {
    setLoading(true);
    try {
      const data = await getCursos(qParam);
      setCursos(data);
    } catch (error) {
      console.error("❌ Error al obtener cursos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    estudiantes,
    cursos,
    loading,
    refetchEstudiantes: fetchEstudiantes,
    refetchCursos: fetchCursos,
  };
};
