import axios from "axios";
import { Curso } from "../modulos/Cursos/types/cursos.types";

// ⚡ Usando variables de entorno
const API_URL = `${import.meta.env.VITE_API_URL}/Cursos`;

// ✅ Función para convertir "dd/MM/yyyy" → "yyyy-MM-dd"
const convertirFecha = (fecha: string): string => {
  if (!fecha.includes("/")) return fecha;
  const [day, month, year] = fecha.split("/");
  return `${year}-${month}-${day}`;
};

// ✅ Función para formatear "yyyy-MM-dd" → "dd/MM/yyyy"
const formatFecha = (fecha: string | null | undefined): string => {
  if (!fecha) return "Sin Fecha";

  try {
    const dateObj = new Date(fecha);

    if (isNaN(dateObj.getTime())) {
      console.warn(`⚠️ La fecha recibida no es válida: ${fecha}`);
      return "Fecha inválida";
    }

    const dia = ("0" + dateObj.getDate()).slice(-2);
    const mes = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const anio = dateObj.getFullYear();

    return `${dia}/${mes}/${anio}`;
  } catch (error) {
    console.error("❌ Error al formatear la fecha:", error);
    return "Sin Fecha";
  }
};

// 🔄 Obtener todos los cursos
export const getCursos = async (): Promise<Curso[]> => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener cursos:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

// 🔄 Crear un curso
export const createCurso = async (curso: Partial<Curso>): Promise<number> => {
  try {
    // Si tienes fechas, conviértelas aquí:
    // curso.fecha_inicio = convertirFecha(curso.fecha_inicio!);
    // curso.fecha_fin = convertirFecha(curso.fecha_fin!);

    const { data } = await axios.post(API_URL, curso);
    return data; // El backend retorna el id del nuevo curso
  } catch (error: any) {
    console.error("❌ Error al crear el curso:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

// 🔄 Actualizar curso
export const updateCurso = async (
  id: number,
  curso: Partial<Curso>
): Promise<void> => {
  try {
    // curso.fecha_inicio = convertirFecha(curso.fecha_inicio!);
    // curso.fecha_fin = convertirFecha(curso.fecha_fin!);

    await axios.put(`${API_URL}/${id}`, curso);
  } catch (error: any) {
    console.error("❌ Error al actualizar el curso:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

// 🔄 Eliminar curso
export const deleteCurso = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error: any) {
    console.error("❌ Error al eliminar el curso:", error.message);
    if (error.response) {
      console.error("❌ Detalle del error:", error.response.data);
    }
    throw error;
  }
};

// Exporta helpers si los necesitas en component
