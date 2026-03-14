import { useState, useCallback } from "react";
import {
  Estudiante,
  Curso,
  InscripcionRequest,
  InscripcionDetalle,
} from "../types/inscripciones.types";
import {
  getEstudiantes,
  getCursos,
  createInscripcion,
  getInscripciones,
  deleteInscripcion,
} from "../../../api/inscripcionesService";

export const useInscripciones = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [inscripciones, setInscripciones] = useState<InscripcionDetalle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEstudiantes = useCallback(async (qParam: string = "") => {
    setLoading(true);
    try {
      const data = await getEstudiantes(qParam);
      setEstudiantes(data);
    } catch (error) {
      console.error("❌ Error al obtener estudiantes:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCursos = useCallback(async (qParam: string = "") => {
    setLoading(true);
    try {
      const data = await getCursos(qParam);
      setCursos(data);
    } catch (error) {
      console.error("❌ Error al obtener cursos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInscripciones = useCallback(
    async (
      alumno?: string,
      cursoNombre?: string,
      fechaDesde?: string,
      fechaHasta?: string,
    ) => {
      setLoading(true);
      try {
        const data = await getInscripciones(
          alumno,
          cursoNombre,
          fechaDesde,
          fechaHasta,
        );
        setInscripciones(data);
      } catch (error) {
        console.error("❌ Error al obtener inscripciones:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const insertarInscripcion = useCallback(async (input: InscripcionRequest) => {
    setLoading(true);
    try {
      return await createInscripcion(input);
    } catch (error) {
      console.error("❌ Error al insertar inscripción:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarInscripcion = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await deleteInscripcion(id);
    } catch (error) {
      console.error("❌ Error al eliminar inscripción:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    estudiantes,
    cursos,
    inscripciones,
    loading,
    refetchEstudiantes: fetchEstudiantes,
    refetchCursos: fetchCursos,
    refetchInscripciones: fetchInscripciones,
    insertarInscripcion,
    eliminarInscripcion,
  };
};
