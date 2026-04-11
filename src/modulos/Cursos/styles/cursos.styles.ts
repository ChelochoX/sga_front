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
  gap: "24px",
  width: "100%",
  padding: "32px 0 0 0",
  boxSizing: "border-box" as const,
  alignItems: "stretch",
  justifyItems: "center",
};

export const cardCursoStyle = {
  width: "100%",
  maxWidth: 430,
  minHeight: 350,
  borderRadius: "14px",
  boxShadow: "0 6px 32px rgba(72, 78, 114, 0.09)",
  padding: "24px 24px 20px 24px",
  background: "#fff",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
  overflow: "hidden",
  boxSizing: "border-box" as const,
};

export const cardActionsRow = {
  display: "flex",
  gap: "12px",
  marginTop: "20px",
  justifyContent: "center",
  flexWrap: "wrap" as const,
};
