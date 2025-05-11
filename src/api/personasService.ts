import axios from "axios";
import { Persona } from "../pages/Personas/types/personas.types";

// ✅ Usando variable de entorno del .env.development
const API_URL = `${import.meta.env.VITE_API_URL}/Personas`;

// Obtener todas las personas
export const getPersonas = async (filtro: string = ""): Promise<Persona[]> => {
  try {
    // 👇 Enviamos el filtro como query param
    const response = await axios.get(API_URL, {
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

// Crear una persona
export const createPersona = async (persona: Persona): Promise<Persona> => {
  try {
    // 🔥 Removemos el id antes de enviar
    const { id, ...personaRequest } = persona;
    const response = await axios.post(API_URL, personaRequest);
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

    await axios.put(`${API_URL}/${id}`, formattedPersona);
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
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("❌ Error eliminando la persona:", error);
    throw error;
  }
};
