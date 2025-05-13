import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
} from "@mui/material";
import { useUsuarios } from "../hooks/useUsuarios"; // Asegúrate de que la ruta sea correcta

const UsuariosPage: React.FC = () => {
  const {
    usuarios,
    total,
    loading,
    setFilter,
    setPageNumber,
    setPageSize,
    toggleUsuarioEstado,
  } = useUsuarios();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage + 1); // Ajustamos la página a 1-based para la paginación
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(1);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Gestión de Usuarios
      </Typography>

      {/* Filtro de búsqueda */}
      <TextField
        label="Buscar usuario..."
        variant="outlined"
        onChange={handleSearchChange}
        fullWidth
        size="small"
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre de Usuario</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Fecha de Modificación</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.idUsuario}>
                  <TableCell>{usuario.nombreUsuario}</TableCell>
                  <TableCell>{usuario.estado}</TableCell>
                  <TableCell>{usuario.fechaCreacion}</TableCell>{" "}
                  {/* Fecha formateada */}
                  <TableCell>{usuario.fechaModificacion}</TableCell>{" "}
                  {/* Fecha formateada */}
                  <TableCell>
                    <Button
                      onClick={() => toggleUsuarioEstado(usuario.idUsuario)}
                      variant="contained"
                      color={usuario.estado === "activo" ? "error" : "success"}
                    >
                      {usuario.estado === "activo" ? "Desactivar" : "Activar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Paginación */}
      <TablePagination
        component="div"
        count={total}
        page={0} // Ajustamos la página a 0-based para la paginación
        onPageChange={handleChangePage}
        rowsPerPage={10} // Ajuste en el tamaño de filas
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default UsuariosPage;
