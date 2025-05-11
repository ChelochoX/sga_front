import axios from "axios";
import { Persona } from "../pages/Personas/types/personas.types";

// ✅ Usando variable de entorno del .env.development
const API_URL = `${import.meta.env.VITE_API_URL}/Personas`;

// Obtener todas las personas
export const getPersonas = async (): Promise<Persona[]> => {
  try {
    const response = await axios.get(API_URL);
    const personas = response.data.map((p: any) => ({
      ...p,
      id: p.idPersona, // 🔥 Mapeo de idPersona a id
    }));
    return personas;
  } catch (error) {
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

// Actualizar una persona
export const updatePersona = async (
  id: number,
  persona: Persona
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/${id}`, persona);
  } catch (error) {
    console.error("❌ Error actualizando la persona:", error);
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
