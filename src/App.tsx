import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import Login from "./modulos/Login/Login";
import ChangePassword from "./modulos/CambiarContrasena/ChangePassword";
import Personas from "./modulos/Personas/pages/PersonasPage";
import Dashboard from "./modulos/Dashboard/Dashboard";
import Usuarios from "./modulos/Usuarios/pages/UsuariosPage";
import RolesPage from "./modulos/Permisos/pages/RolesPage";
import PermisosPage from "./modulos/Permisos/pages/PermisosPage";
import Cursos from "./modulos/Cursos/pages/CursosPage";
import Inscripciones from "./modulos/Inscripciones/pages/InscripcionesPage";
import Pagos from "./modulos/Pagos/pages/PagosPage";
import CajaMovimientos from "./modulos/Caja/pages/CajaMovimientosPage";
import CajaAnulaciones from "./modulos/Caja/pages/CajaAnulacionesPage";
import AccesoDenegado from "./utils/accesoDenegado";
import RutaProtegida from "./components/RutaProtegida";
import DocumentosFiscalesConfigPage from "./modulos/DocumentosFiscalesConfig/pages/DocumentosFiscalesConfigPage";

// 🟣 Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cambiar-contrasena" element={<ChangePassword />} />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route element={<RutaProtegida modulo="personas" />}>
              <Route path="personas" element={<Personas />} />
            </Route>

            <Route element={<RutaProtegida modulo="usuarios" />}>
              <Route path="usuarios" element={<Usuarios />} />
            </Route>

            <Route element={<RutaProtegida modulo="roles" />}>
              <Route path="roles" element={<RolesPage />} />
            </Route>

            <Route element={<RutaProtegida modulo="roles" />}>
              <Route path="permisos" element={<PermisosPage />} />
            </Route>

            <Route element={<RutaProtegida modulo="roles" />}>
              <Route
                path="documentos-fiscales"
                element={<DocumentosFiscalesConfigPage />}
              />
            </Route>

            <Route element={<RutaProtegida modulo="cursos" />}>
              <Route path="cursos" element={<Cursos />} />
            </Route>

            <Route element={<RutaProtegida modulo="inscripciones" />}>
              <Route path="inscripciones" element={<Inscripciones />} />
            </Route>

            <Route element={<RutaProtegida modulo="pagos" />}>
              <Route path="pagos" element={<Pagos />} />
            </Route>

            <Route element={<RutaProtegida modulo="caja" />}>
              <Route path="caja/movimientos" element={<CajaMovimientos />} />
              <Route path="caja/anulaciones" element={<CajaAnulaciones />} />
            </Route>
          </Route>
        </Routes>

        {/* 📣 Toast notifications globales */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
