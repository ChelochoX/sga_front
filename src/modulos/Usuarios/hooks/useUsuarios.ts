import { useState, useEffect } from "react";
import axios from "axios";
import { Usuario } from "../types/usuarios.types";
import {
  cambiarEstadoUsuario,
  actualizarUsuario,
} from "../../../api/usuariosService";

// Función para formatear fechas correctamente
const formatFecha = (fecha: string | Date | null | undefined) => {
  if (!fecha || fecha === "") return "Sin Fecha";
  try {
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) {
      return "Sin Fecha";
    }
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);
  } catch (error) {
    console.error("❌ Error al formatear la fecha: ", error);
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

  // 🚀 Función para obtener usuarios con paginación y filtro
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
    } catch (error: any) {
      console.error("❌ Error fetching usuarios:", error.message);
      if (error.response) {
        console.error("❌ Detalle del error:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Función para cambiar el estado de un usuario
  const toggleUsuarioEstado = async (id: number) => {
    console.log(`🔄 Intentando cambiar el estado del usuario con ID: ${id}`);
    try {
      await cambiarEstadoUsuario(id);

      // 🔄 Refrescar solo el estado del usuario afectado
      setUsuarios((prev: Usuario[]) =>
        prev.map((usuario) =>
          usuario.idUsuario === id
            ? {
                ...usuario,
                estado: usuario.estado === "Activo" ? "Inactivo" : "Activo",
                fechaModificacion: new Date().toLocaleString(),
              }
            : usuario
        )
      );

      console.log(
        `✅ Estado del usuario con ID ${id} actualizado correctamente.`
      );
    } catch (error) {
      console.error("❌ Error al cambiar estado del usuario:", error);
    }
  };

  // ✅ Función para actualizar datos del usuario
  const editUsuario = async (updatedData: Partial<Usuario>) => {
    try {
      await actualizarUsuario(updatedData);

      setUsuarios((prev: Usuario[]) =>
        prev.map((usuario) =>
          usuario.idUsuario === updatedData.idUsuario
            ? { ...usuario, ...updatedData }
            : usuario
        )
      );
    } catch (error) {
      console.error("❌ Error al actualizar el usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [filter, pageNumber, pageSize]);

  // ✅ Retornamos las funciones necesarias, incluyendo las que faltaban
  return {
    usuarios,
    total,
    loading,
    setFilter,
    setPageNumber, // ✅ Exportado correctamente
    setPageSize, // ✅ Exportado correctamente
    toggleUsuarioEstado,
    editUsuario,
  };
};
