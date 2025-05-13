import { useState, useEffect } from "react";
import axios from "axios";
import { Usuario } from "../types/usuarios.types";
import { activarUsuario } from "../../../api/usuariosService";

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

  // Función para obtener usuarios con paginación y filtro
  const fetchUsuarios = async () => {
    setLoading(true);

    // 🚀 Logs de depuración
    console.log("🚀 URL Final:", `/api/usuarios/obtener-usuarios`);
    console.log("📌 Parámetros enviados:", {
      filtro: filter,
      pageNumber: pageNumber,
      pageSize: pageSize,
    });

    try {
      const response = await axios.get("/api/usuarios/obtener-usuarios", {
        params: {
          filtro: filter,
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      // ✅ Log de la respuesta
      console.log("✅ Respuesta del servidor:", response.data);

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

  // Función para cambiar el estado de un usuario
  const toggleUsuarioEstado = async (id: number) => {
    console.log(`🔄 Intentando cambiar el estado del usuario con ID: ${id}`);
    try {
      await activarUsuario(id);
      console.log(`✅ Usuario con ID ${id} actualizado correctamente.`);

      setUsuarios((prev: Usuario[]) =>
        prev.map((usuario) =>
          usuario.idUsuario === id
            ? {
                ...usuario,
                estado: usuario.estado === "activo" ? "inactivo" : "activo",
              }
            : usuario
        )
      );
    } catch (error) {
      console.error("❌ Error al cambiar estado del usuario:", error);
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
    toggleUsuarioEstado,
  };
};
