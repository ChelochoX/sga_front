// src/utils/errorHandler.ts
export const handleApiError = (error: any): never => {
  const status = error.response?.status;
  const mensaje =
    error.response?.data?.message || "Ocurrió un error inesperado.";

  if (status === 403) {
    // Redirige solo si no estás ya en la página de acceso denegado
    if (!window.location.pathname.includes("/acceso-denegado")) {
      window.location.replace(
        `/acceso-denegado?mensaje=${encodeURIComponent(mensaje)}`
      );
    }
  }

  // Podés manejar otros códigos si querés (ej: 401, 500, etc.)
  throw error;
};
