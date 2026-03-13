import { useState, useEffect } from "react";
import { Persona } from "../types/personas.types";
import {
  getPersonas,
  createPersona,
  updatePersona,
  deletePersona,
} from "../../../api/personasService";
import { formatDateToDisplay } from "../../../utils/dateUtils";

export const usePersonas = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const fetchPersonas = async () => {
    setLoading(true);
    try {
      const data = await getPersonas(filter);

      const formattedData = data.map((persona) => ({
        ...persona,
        fechaNacimiento: formatDateToDisplay(persona.fechaNacimiento),
        fechaRegistro: formatDateToDisplay(persona.fechaRegistro),
      }));

      setPersonas(formattedData);
    } catch (error) {
      console.error("Error fetching personas:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addPersona = async (persona: Persona) => {
    try {
      const newPersona = await createPersona(persona);
      setPersonas((prev) => [...prev, newPersona]);
      return newPersona;
    } catch (error) {
      console.error("Error creating persona:", error);
      throw error;
    }
  };

  const editPersona = async (id: number, persona: Persona) => {
    try {
      await updatePersona(id, persona);
      setPersonas((prev) =>
        prev.map((p) => (p.id === id ? { ...persona, id } : p)),
      );
    } catch (error) {
      console.error("Error updating persona:", error);
      throw error;
    }
  };

  const removePersona = async (id: number) => {
    try {
      await deletePersona(id);
      setPersonas((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting persona:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPersonas().catch((error) => {
      console.error("Error inicial cargando personas:", error);
    });
  }, [filter]);

  return {
    personas,
    loading,
    addPersona,
    editPersona,
    removePersona,
    fetchPersonas,
    setFilter,
  };
};
