// src/components/RutaProtegida.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { puedeVerModulo } from "../api/authService";

interface Props {
  modulo: string;
}

const RutaProtegida: React.FC<Props> = ({ modulo }) => {
  const location = useLocation();

  if (!puedeVerModulo(modulo)) {
    const mensaje = encodeURIComponent(
      `No tenés permiso para acceder al módulo "${modulo}".`
    );
    return (
      <Navigate
        to={`/acceso-denegado?mensaje=${mensaje}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default RutaProtegida;
