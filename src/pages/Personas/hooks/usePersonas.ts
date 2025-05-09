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

  // ✅ Función para formatear fechas correctamente
  const formatFecha = (fecha: string | Date | null | undefined) => {
    if (!fecha || fecha === "") return "Sin Fecha";
    try {
      // Convertimos la fecha a un objeto Date
      const dateObj = new Date(fecha);
      if (isNaN(dateObj.getTime())) {
        // Si la fecha es inválida, retornamos "Sin Fecha"
        return "Sin Fecha";
      }
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(dateObj);
    } catch (error) {
      console.error("Error al formatear la fecha: ", error);
      return "Sin Fecha";
    }
  };

  const fetchPersonas = async () => {
    setLoading(true);
    try {
      const data = await getPersonas();
      console.log("🔍 Datos del backend antes del formateo:", data);

      // ✅ Preprocesamos los datos para formatear fechas
      const formattedData = data.map((persona) => ({
        ...persona,
        fechaNacimiento: formatFecha(persona.fechaNacimiento),
        fechaRegistro: formatFecha(persona.fechaRegistro),
      }));

      console.log("📌 Datos formateados para el DataGrid:", formattedData);
      setPersonas(formattedData);
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
    fetchPersonas,
  };
};
