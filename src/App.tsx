// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./modulos/Login/Login";
import ChangePassword from "./modulos/CambiarContrasena/ChangePassword";
import Personas from "./modulos/Personas/pages/PersonasPage";
import Dashboard from "./modulos/Dashboard/Dashboard";
import Usuarios from "./modulos/Usuarios/pages/UsuariosPage";
import Permisos from "./modulos/Permisos/pages/PermisosPage";
// import Cursos from "./pages/Cursos/Cursos";
// import Inscripciones from "./pages/Inscripciones/Inscripciones";
// import Pagos from "./pages/Pagos/Pagos";
// import Caja from "./pages/Caja/Caja";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cambiar-contrasena" element={<ChangePassword />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="personas" element={<Personas />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="roles" element={<Permisos />} />
          {/*<Route path="cursos" element={<Cursos />} />
        <Route path="inscripciones" element={<Inscripciones />} />
        <Route path="pagos" element={<Pagos />} />
        <Route path="caja" element={<Caja />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
