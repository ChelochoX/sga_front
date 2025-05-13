import { useState, useEffect } from "react";
import axios from "axios";
import { Usuario } from "../types/usuarios.types";
import { activarUsuario } from "../../../api/usuariosService";

// Función para formatear fechas correctamente
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

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Función para obtener usuarios con paginación y filtro
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/usuarios/obtener-usuarios", {
        params: {
          filtro: filter,
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      const { usuarios, total } = response.data;

      // Formateamos las fechas de los usuarios
      const formattedData = usuarios.map((usuario: Usuario) => ({
        ...usuario,
        fechaCreacion: formatFecha(usuario.fechaCreacion),
        fechaModificacion: formatFecha(usuario.fechaModificacion),
      }));

      setUsuarios(formattedData);
      setTotal(total);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el estado de un usuario
  const toggleUsuarioEstado = async (id: number) => {
    try {
      // Llamada al backend para activar/desactivar el usuario
      await activarUsuario(id);

      // Actualizamos el estado de los usuarios
      setUsuarios((prev: Usuario[]) =>
        prev.map((usuario) =>
          usuario.idUsuario === id // Usamos `idUsuario` en vez de `id` según la estructura de tu modelo
            ? {
                ...usuario,
                estado: usuario.estado === "activo" ? "inactivo" : "activo", // Cambiar el estado
              }
            : usuario
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
    }
  };
  useEffect(() => {
    fetchUsuarios();
  }, [filter, pageNumber, pageSize]);

  return {
    usuarios,
    total,
    loading,
    setFilter,
    setPageNumber,
    setPageSize,
    toggleUsuarioEstado, // Retornar la función para ser utilizada en el componente
  };
};
