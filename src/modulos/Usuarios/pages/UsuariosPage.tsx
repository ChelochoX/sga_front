import React, { useState } from "react";
import {
  Button, // ✅ Importado correctamente
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
  InputAdornment,
  IconButton,
  Box,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useUsuarios } from "../hooks/useUsuarios"; // Asegúrate de que la ruta sea correcta
import { useTheme } from "@mui/material/styles";

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

  const [searchText, setSearchText] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 📱 Detectar si es móvil

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
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
    <Box p={2}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Gestión de Usuarios
      </Typography>

      {/* 🔎 Filtro de búsqueda con estilo corregido */}
      <TextField
        placeholder="Buscar usuario..."
        variant="outlined"
        value={searchText}
        onChange={handleSearchChange}
        fullWidth
        size="small"
        sx={{
          marginBottom: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#aaa",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton edge="start">
                <Search />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Loader */}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {isMobile ? (
            <Grid container spacing={2}>
              {usuarios.map((usuario) => (
                <Grid item xs={12} key={usuario.idUsuario}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">
                        {usuario.nombreUsuario}
                      </Typography>
                      <Typography color="textSecondary">
                        Estado: {usuario.estado}
                      </Typography>
                      <Typography color="textSecondary">
                        Fecha de Creación: {usuario.fechaCreacion}
                      </Typography>
                      <Typography color="textSecondary">
                        Fecha de Modificación: {usuario.fechaModificacion}
                      </Typography>
                      <Box mt={2}>
                        <Button
                          onClick={() => toggleUsuarioEstado(usuario.idUsuario)}
                          variant="contained"
                          color={
                            usuario.estado === "activo" ? "error" : "success"
                          }
                          fullWidth
                        >
                          {usuario.estado === "activo"
                            ? "Desactivar"
                            : "Activar"}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
                      <TableCell>{usuario.fechaCreacion}</TableCell>
                      <TableCell>{usuario.fechaModificacion}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => toggleUsuarioEstado(usuario.idUsuario)}
                          variant="contained"
                          color={
                            usuario.estado === "activo" ? "error" : "success"
                          }
                        >
                          {usuario.estado === "activo"
                            ? "Desactivar"
                            : "Activar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Paginación */}
      <TablePagination
        component="div"
        count={total}
        page={0}
        onPageChange={handleChangePage}
        rowsPerPage={10}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default UsuariosPage;
