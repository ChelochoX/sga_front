import { useState, useEffect } from "react";
import { Persona } from "../types/personas.types";
import {
  getPersonas,
  createPersona,
  updatePersona,
  deletePersona,
} from "../../../api/personasService";

export const usePersonas = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPersonas = async () => {
    setLoading(true);
    try {
      const data = await getPersonas();
      setPersonas(data);
    } catch (error) {
      console.error("Error fetching personas:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPersona = async (persona: Persona) => {
    try {
      const newPersona = await createPersona(persona);
      setPersonas((prev) => [...prev, newPersona]);
    } catch (error) {
      console.error("Error creating persona:", error);
    }
  };

  const editPersona = async (id: number, persona: Persona) => {
    try {
      await updatePersona(id, persona);
      setPersonas((prev) =>
        prev.map((p) => (p.id === id ? { ...persona, id } : p))
      );
    } catch (error) {
      console.error("Error updating persona:", error);
    }
  };

  const removePersona = async (id: number) => {
    try {
      await deletePersona(id);
      setPersonas((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting persona:", error);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  return {
    personas,
    loading,
    addPersona,
    editPersona,
    removePersona,
  };
};
