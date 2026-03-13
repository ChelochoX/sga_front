export const handleApiError = (error: any): void => {
  const status = error.response?.status;
  const mensaje =
    error.response?.data?.message ||
    error.response?.data?.title ||
    "Ocurrió un error inesperado.";

  if (status === 403) {
    if (!window.location.pathname.includes("/acceso-denegado")) {
      window.location.replace(
        `/acceso-denegado?mensaje=${encodeURIComponent(mensaje)}`,
      );
    }
  }
};
