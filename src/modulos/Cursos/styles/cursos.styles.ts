export const filtrosContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
  margin: "32px 0 0 0",
  width: "230px",
  maxWidth: "100%",
};

export const gridCursosStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", // baja el mínimo
  gap: "32px",
  alignItems: "stretch",
  width: "100%",
  padding: "32px 0 0 0",
};

export const cardCursoStyle = {
  width: "100%", // Cambia a 100% para que crezca con la columna
  maxWidth: 370, // Ajusta el máximo para que no sea gigante
  minHeight: 350, // Sube la altura mínima para dejar respirar el contenido
  borderRadius: "14px",
  boxShadow: "0 6px 32px rgba(72, 78, 114, 0.09)",
  padding: "24px 24px 20px 24px",
  background: "#fff",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
  overflow: "visible", // <- permite overflow si un texto es largo
};

export const cardActionsRow = {
  display: "flex",
  gap: "12px",
  marginTop: "20px",
  justifyContent: "flex-end",
};
