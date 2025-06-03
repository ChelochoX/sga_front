import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./modulos/Login/Login";
import ChangePassword from "./modulos/CambiarContrasena/ChangePassword";
import Personas from "./modulos/Personas/pages/PersonasPage";
import Dashboard from "./modulos/Dashboard/Dashboard";
import Usuarios from "./modulos/Usuarios/pages/UsuariosPage";
import RolesPage from "./modulos/Permisos/pages/RolesPage";
import PermisosPage from "./modulos/Permisos/pages/PermisosPage";
import Cursos from "./modulos/Cursos/pages/CursosPage";
import Inscripciones from "./modulos/Inscripciones/pages/InscripcionesPage";
// import Pagos from "./modulos/Pagos/pages/PagosPage";
// import Caja from "./modulos/Caja/pages/CajaPage";

// 🟣 Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cambiar-contrasena" element={<ChangePassword />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="personas" element={<Personas />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="permisos" element={<PermisosPage />} />
          <Route path="cursos" element={<Cursos />} />
          <Route path="inscripciones" element={<Inscripciones />} />
          {/*<Route path="pagos" element={<Pagos />} />
          <Route path="caja" element={<Caja />} />*/}
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
  );
};

export default App;
