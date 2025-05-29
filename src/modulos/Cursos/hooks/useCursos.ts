import { useEffect, useState } from "react";
import * as cursosService from "../../../api/cursosService";
import { Curso, ObtenerCursosRequest } from "../types/cursos.types";

// Helper para obtener la fecha de hoy en yyyy-MM-dd
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

  // Permite recibir params por si luego quieres filtrar por rango
  const fetchCursos = async (params?: ObtenerCursosRequest) => {
    setLoading(true);
    // Si no se pasan parámetros, usa la fecha de hoy por defecto
    const filtro: ObtenerCursosRequest = params ?? {
      fechaInicio: getTodayYYYYMMDD(),
    };
    const cursos = await cursosService.getCursos(filtro);
    setCursos(cursos);
    setLoading(false);
  };

  // Al cargar el componente, trae los cursos de la fecha de hoy
  useEffect(() => {
    fetchCursos();
  }, []);

  return { cursos, setCursos, fetchCursos, loading };
}
