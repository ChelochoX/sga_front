// src/modulos/Cursos/hooks/useCursos.ts
import { useEffect, useState, useCallback } from "react";
import * as cursosService from "../../../api/cursosService";
import { Curso, ObtenerCursosRequest } from "../types/cursos.types";

function getTodayYYYYMMDD() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);

  // Listar cursos
  const fetchCursos = useCallback(async (params?: ObtenerCursosRequest) => {
    setLoading(true);
    const filtro: ObtenerCursosRequest = params ?? {
      fechaInicio: getTodayYYYYMMDD(),
    };

    const cursos = await cursosService.getCursos(filtro);
    setCursos(cursos);
    setLoading(false);
  }, []);

  // Eliminar curso
  const eliminarCurso = useCallback(
    async (id: number) => {
      setLoading(true);
      await cursosService.deleteCurso(id);
      await fetchCursos(); // refresca la lista después de borrar
      setLoading(false);
    },
    [fetchCursos]
  );

  useEffect(() => {
    fetchCursos();
  }, []);

  return { cursos, setCursos, fetchCursos, eliminarCurso, loading };
}
