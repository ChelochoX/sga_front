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

  // SOLO UNA REFERENCIA
  const fetchCursos = useCallback(async (params?: ObtenerCursosRequest) => {
    setLoading(true);
    const filtro: ObtenerCursosRequest = params ?? {
      fechaInicio: getTodayYYYYMMDD(),
    };

    const cursos = await cursosService.getCursos(filtro);
    setCursos(cursos);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCursos();
  }, []); // SOLO [] ← No pongas fetchCursos acá

  return { cursos, setCursos, fetchCursos, loading };
}
