import axios from "axios";
import { Persona } from "../pages/Personas/types/personas.types";

const API_URL = "/api/personas";

export const getPersonas = async (): Promise<Persona[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createPersona = async (persona: Persona): Promise<Persona> => {
  const response = await axios.post(API_URL, persona);
  return response.data;
};

export const updatePersona = async (
  id: number,
  persona: Persona
): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, persona);
};

export const deletePersona = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
