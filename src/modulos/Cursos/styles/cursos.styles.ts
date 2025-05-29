export const filtrosContainer = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "stretch",
  gap: "12px",
  margin: "32px 0 0 0",
  width: "230px",
  minWidth: "200px",
  maxWidth: "100%",
};

export const gridCursosStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
  gap: "32px",
  justifyItems: "center",
  alignItems: "start",
  width: "100%",
  padding: "32px 0 0 0",
};

export const cardCursoStyle = {
  width: "320px",
  minHeight: "310px",
  borderRadius: "16px",
  boxShadow: "0 6px 32px rgba(72, 78, 114, 0.09)",
  padding: "20px 24px 16px 24px",
  background: "#fff",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
};

export const cardActionsRow = {
  display: "flex",
  gap: "12px",
  marginTop: "20px",
  justifyContent: "flex-end",
};
