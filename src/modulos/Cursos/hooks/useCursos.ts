import { useState, useCallback } from "react";
import * as cursosService from "../../../api/cursosService";
import { CursoListado, ObtenerCursosRequest } from "../types/cursos.types";

export function useCursos() {
  const [cursos, setCursos] = useState<CursoListado[]>([]);
  const [loading, setLoading] = useState(false);

  const [ultimoFiltro, setUltimoFiltro] = useState<ObtenerCursosRequest>({
    fechaInicio: null,
    fechaFin: null,
    activo: null,
  });

  const fetchCursos = useCallback(
    async (params?: ObtenerCursosRequest) => {
      setLoading(true);

      try {
        const filtro: ObtenerCursosRequest = params ?? ultimoFiltro;
        setUltimoFiltro(filtro);

        const data = await cursosService.getCursos(filtro);
        setCursos(data);
      } catch (error) {
        console.error("Error al obtener cursos:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [ultimoFiltro],
  );

  const eliminarCurso = useCallback(async (id: number) => {
    setLoading(true);

    try {
      await cursosService.deleteCurso(id);
      setCursos((prev) => prev.filter((curso) => curso.idCurso !== id));
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cursos,
    setCursos,
    fetchCursos,
    eliminarCurso,
    loading,
    ultimoFiltro,
  };
}
