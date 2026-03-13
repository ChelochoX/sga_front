import instance from "./axiosInstance";
import { Persona } from "../modulos/Personas/types/personas.types";
import { handleApiError } from "../utils/errorHandler";
import { formatDateToYYYYMMDD } from "../utils/dateUtils";
import { normalizeApiError } from "../utils/apiError";

const API_URL = `/Personas`;

//
// ==========================================================
// GET /Personas
// Obtiene la lista de personas aplicando filtro opcional
// ==========================================================
//
export const getPersonas = async (filtro: string = ""): Promise<Persona[]> => {
  try {
    const response = await instance.get(API_URL, {
      params: {
        filtro,
      },
    });

    const personas = response.data.items.map((p: any) => ({
      ...p,
      id: p.idPersona,
      fechaNacimiento: formatDateToYYYYMMDD(p.fechaNacimiento) ?? "",
      fechaRegistro: formatDateToYYYYMMDD(p.fechaRegistro) ?? "",
    }));

    return personas;
  } catch (error) {
    console.error("❌ Error al obtener personas:", error);
    handleApiError(error);
    throw normalizeApiError(error);
  }
};

//
// ==========================================================
// POST /Personas
// Crea una nueva persona
// ==========================================================
//
export const createPersona = async (persona: Persona): Promise<Persona> => {
  try {
    const { id, ...personaRequest } = persona;

    const payload = {
      ...personaRequest,
      fechaNacimiento: formatDateToYYYYMMDD(personaRequest.fechaNacimiento),
      fechaRegistro: personaRequest.fechaRegistro
        ? formatDateToYYYYMMDD(personaRequest.fechaRegistro)
        : null,
    };

    const response = await instance.post(API_URL, payload);
    return response.data;
  } catch (error) {
    console.error("❌ Error creando la persona:", error);
    handleApiError(error);
    throw normalizeApiError(error);
  }
};

//
// ==========================================================
// PUT /Personas/{id}
// Actualiza una persona existente
// ==========================================================
//
export const updatePersona = async (
  id: number,
  persona: Persona,
): Promise<void> => {
  try {
    const payload = {
      ...persona,
      fechaNacimiento: formatDateToYYYYMMDD(persona.fechaNacimiento),
      fechaRegistro: persona.fechaRegistro
        ? formatDateToYYYYMMDD(persona.fechaRegistro)
        : null,
    };

    await instance.put(`${API_URL}/${id}`, payload);
  } catch (error) {
    console.error("❌ Error actualizando la persona:", error);
    handleApiError(error);
    throw normalizeApiError(error);
  }
};

//
// ==========================================================
// DELETE /Personas/{id}
// Elimina una persona por su identificador
// ==========================================================
//
export const deletePersona = async (id: number): Promise<void> => {
  try {
    await instance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("❌ Error eliminando la persona:", error);
    handleApiError(error);
    throw normalizeApiError(error);
  }
};
