import { useEffect, useState } from "react";
import * as cursosService from "../../../api/cursosService";
import { Curso } from "../types/cursos.types";

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCursos = async () => {
    setLoading(true);
    const cursos = await cursosService.getCursos();
    setCursos(cursos);
    setLoading(false);
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  return { cursos, fetchCursos, loading };
}
