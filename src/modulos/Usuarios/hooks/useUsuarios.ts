import { useState, useEffect } from "react";
import { Usuario } from "../types/usuarios.types";
import {
  getUsuarios,
  cambiarEstadoUsuario,
  actualizarUsuario,
} from "../../../api/usuariosService";

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
      const data = await getUsuarios(filter);
      setUsuarios(data);
      setTotal(data.length); // Opcional, si quieres mostrar el total
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
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
                fechaModificacion: new Date().toISOString(),
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
    fetchUsuarios,
  };
};
