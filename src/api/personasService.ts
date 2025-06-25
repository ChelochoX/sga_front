import instance from "./axiosInstance";
import { Persona } from "../modulos/Personas/types/personas.types";

// ✅ Usando variable de entorno del .env.development
const API_URL = `${import.meta.env.VITE_API_URL}/Personas`;

// Obtener todas las personas
export const getPersonas = async (filtro: string = ""): Promise<Persona[]> => {
  try {
    // 👇 Enviamos el filtro como query param
    const response = await instance.get(API_URL, {
      params: {
        filtro,
      },
    });

    // ✅ Accedemos a "items" en lugar de data directamente
    const personas = response.data.items.map((p: any) => ({
      ...p,
      id: p.idPersona, // 🔥 Mapeo de idPersona a id
    }));

    return personas;
  } catch (error) {
    console.error("❌ Error al obtener personas:", error);
    throw error;
  }
};

// ✅ Función para convertir "dd/MM/yyyy" → "yyyy-MM-dd"
export const formatFecha = (fecha: string): string => {
  if (!fecha.includes("/")) return fecha; // Si ya está formateado, lo dejamos
  const [day, month, year] = fecha.split("/");
  return `${year}-${month}-${day}`;
};

// Crear una persona
export const createPersona = async (persona: Persona): Promise<Persona> => {
  try {
    // 🔄 Removemos el id antes de enviar
    const { id, ...personaRequest } = persona;

    // ✅ Formateamos las fechas antes de enviar
    if (personaRequest.fechaNacimiento) {
      personaRequest.fechaNacimiento = formatFecha(
        personaRequest.fechaNacimiento
      );
    }

    if (personaRequest.fechaRegistro) {
      personaRequest.fechaRegistro = formatFecha(personaRequest.fechaRegistro);
    }

    // 🔥 Enviamos al backend con las fechas ya formateadas
    const response = await instance.post(API_URL, personaRequest);
    return response.data;
  } catch (error) {
    console.error("❌ Error creando la persona:", error);
    throw error;
  }
};

// ✅ Función para convertir "dd/MM/yyyy" → "yyyy-MM-dd"
const convertirFecha = (fecha: string): string => {
  if (!fecha.includes("/")) return fecha; // Si ya está formateado, no hacemos nada
  const [day, month, year] = fecha.split("/");
  return `${year}-${month}-${day}`;
};

// Actualizar una persona
export const updatePersona = async (
  id: number,
  persona: Persona
): Promise<void> => {
  try {
    // ✅ Aplicar el formateo correcto antes de enviar al backend
    const formattedPersona = {
      ...persona,
      fechaNacimiento: convertirFecha(persona.fechaNacimiento),
      fechaRegistro: convertirFecha(persona.fechaRegistro),
    };

    await instance.put(`${API_URL}/${id}`, formattedPersona);
  } catch (error: any) {
    console.error(
      "❌ Error actualizando la persona:",
      error.response?.data ?? error.message
    );
    throw error;
  }
};

// Eliminar una persona
export const deletePersona = async (id: number): Promise<void> => {
  try {
    await instance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("❌ Error eliminando la persona:", error);
    throw error;
  }
};
