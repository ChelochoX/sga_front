import axios from "axios";
import { Persona } from "../pages/Personas/types/personas.types";

// ✅ Usando variable de entorno del .env.development
const API_URL = `${import.meta.env.VITE_API_URL}/api/Personas`;
console.log("🔎 API_URL configurada:", API_URL); // 🔥 Verificar URL

// Obtener todas las personas
export const getPersonas = async (): Promise<Persona[]> => {
  try {
    console.log("🔄 Realizando petición GET a:", API_URL); // 🔥 Log para verificar
    const response = await axios.get(API_URL);
    console.log("✅ Datos obtenidos:", response.data); // 🔥 Log para verificar datos
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo las personas:", error);
    throw error;
  }
};

// Crear una persona
export const createPersona = async (persona: Persona): Promise<Persona> => {
  try {
    const response = await axios.post(API_URL, persona);
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
