// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ChangePassword from "./pages/CambiarContrasena/ChangePassword";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cambiar-contrasena" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
