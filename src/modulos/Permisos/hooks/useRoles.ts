import { useEffect, useState } from "react";
import { getUsuarios, getRoles } from "../../../api/permisosService";

export const useRoles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usuarioData = await getUsuarios(search, page);
        const rolesData = await getRoles();
        setUsuarios(usuarioData.usuarios);
        setRoles(rolesData);
      } catch (err: any) {
        console.error(err.message);
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, page]);

  return {
    usuarios,
    roles,
    loading,
    error,
    setSearch,
    setPage,
  };
};
