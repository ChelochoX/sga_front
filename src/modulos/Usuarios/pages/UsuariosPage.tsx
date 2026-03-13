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
  InputAdornment,
  IconButton,
  Box,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Person as PersonIcon,
  Event as EventIcon,
  Update as UpdateIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useUsuarios } from "../hooks/useUsuarios";
import { useTheme } from "@mui/material/styles";
import UsuarioForm from "../components/UsuarioForm";
import { Usuario } from "../types/usuarios.types";

const UsuariosPage: React.FC = () => {
  const {
    usuarios,
    total,
    loading,
    setFilter,
    setPageNumber,
    setPageSize,
    toggleUsuarioEstado,
    editUsuario,
    fetchUsuarios,
  } = useUsuarios();

  const [searchText, setSearchText] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | undefined>(
    undefined,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setFilter(e.target.value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPageNumber(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(1);
  };

  const handleEditClick = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setOpenEdit(true);
  };

  const handleSaveEdit = async (
    updatedData: Partial<Usuario>,
  ): Promise<void> => {
    await editUsuario(updatedData);
    await fetchUsuarios();
    setOpenEdit(false);
  };

  const formatFecha = (fecha: string | null | undefined) => {
    if (!fecha) return "Sin Fecha";

    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) return "Fecha inválida";

    return dateObj.toLocaleDateString("es-ES");
  };

  return (
    <Box p={2}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Gestión de Usuarios
      </Typography>

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

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {isMobile ? (
            <Grid container spacing={2}>
              {usuarios.map((usuario) => (
                <Grid item xs={12} key={usuario.idUsuario}>
                  <Card
                    variant="outlined"
                    sx={{ borderRadius: "15px", overflow: "hidden" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#4a4a4a",
                        }}
                      >
                        <PersonIcon color="primary" />
                        {usuario.nombreUsuario}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        {usuario.estado === "Activo" ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                        <Typography fontWeight="bold">Estado:</Typography>
                        <Typography color="primary">
                          {usuario.estado}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <EventIcon color="action" />
                        <Typography fontWeight="bold">Creación:</Typography>
                        <Typography color="primary">
                          {formatFecha(usuario.fechaCreacion)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <UpdateIcon color="action" />
                        <Typography fontWeight="bold">Modificación:</Typography>
                        <Typography color="primary">
                          {formatFecha(usuario.fechaModificacion)}
                        </Typography>
                      </Box>

                      {usuario.requiereCambioContrasena &&
                        usuario.contrasenaTemporal && (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <Typography fontWeight="bold">
                              Contraseña temporal:
                            </Typography>
                            <Typography color="primary">
                              {usuario.contrasenaTemporal}
                            </Typography>
                          </Box>
                        )}

                      <Box mt={2} sx={{ display: "flex", gap: 1 }}>
                        <Button
                          onClick={() => toggleUsuarioEstado(usuario.idUsuario)}
                          variant="contained"
                          color={
                            usuario.estado === "Activo" ? "error" : "success"
                          }
                          fullWidth
                          sx={{
                            backgroundColor:
                              usuario.estado === "Activo"
                                ? "#ff4d4d"
                                : "#4caf50",
                            "&:hover": {
                              backgroundColor:
                                usuario.estado === "Activo"
                                  ? "#ff1a1a"
                                  : "#45a049",
                            },
                          }}
                        >
                          {usuario.estado === "Activo"
                            ? "Desactivar"
                            : "Activar"}
                        </Button>

                        <Button
                          onClick={() => handleEditClick(usuario)}
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<EditIcon />}
                        >
                          Editar
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
                    <TableCell>Contraseña Temporal</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.idUsuario}>
                      <TableCell>{usuario.nombreUsuario}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color:
                              usuario.estado === "Activo" ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {usuario.estado === "Activo" ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <CancelIcon color="error" />
                          )}
                          {usuario.estado}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {formatFecha(usuario.fechaCreacion)}
                      </TableCell>
                      <TableCell>
                        {formatFecha(usuario.fechaModificacion)}
                      </TableCell>
                      <TableCell>
                        {usuario.requiereCambioContrasena &&
                        usuario.contrasenaTemporal ? (
                          <Typography variant="body2" color="primary">
                            {usuario.contrasenaTemporal}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            onClick={() =>
                              toggleUsuarioEstado(usuario.idUsuario)
                            }
                            variant="contained"
                            fullWidth
                            sx={{
                              backgroundColor:
                                usuario.estado === "Activo"
                                  ? "#ff4d4d"
                                  : "#4caf50",
                              color: "white",
                              "&:hover": {
                                backgroundColor:
                                  usuario.estado === "Activo"
                                    ? "#ff1a1a"
                                    : "#45a049",
                              },
                            }}
                          >
                            {usuario.estado === "Activo"
                              ? "Desactivar"
                              : "Activar"}
                          </Button>

                          <Button
                            onClick={() => handleEditClick(usuario)}
                            variant="contained"
                            color="primary"
                            fullWidth
                            startIcon={<EditIcon />}
                          >
                            Editar
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={total}
                page={0}
                onPageChange={handleChangePage}
                rowsPerPage={10}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
                labelRowsPerPage="Filas por página:"
              />
            </TableContainer>
          )}
        </>
      )}

      <UsuarioForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSave={handleSaveEdit}
        initialData={selectedUsuario}
      />
    </Box>
  );
};

export default UsuariosPage;
