import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  TextField,
  Typography,
  List,
  Chip,
  Accordion,
  AccordionSummary,
  Paper,
} from "@mui/material";

export const PageWrapper = styled(Box)({
  padding: 16,
});

export const SearchInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 50,
  },
});

export const PermisoCard = styled(Card)({
  borderRadius: 15,
  background: "#f3f2fc",
  padding: 16,
});

export const PermisoHeader = styled(Typography)({
  fontWeight: 700,
  color: "#4a148c",
});

export const SubHeader = styled(Typography)({
  fontWeight: 600,
  marginTop: 4,
});

export const AccordionWrapper = styled(Accordion)({
  backgroundColor: "#fdf9ff",
  borderRadius: 12,
  marginTop: 8,
  boxShadow: "none",
  border: "1px solid #ececec",
  transition: "box-shadow 0.3s ease",
  "&.Mui-expanded": {
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  "&:before": {
    display: "none",
  },
});

export const AccordionSummaryStyled = styled(AccordionSummary)({
  borderBottom: "1px solid #eee",
  "& .MuiTypography-root": {
    display: "flex",
    gap: 4,
    fontWeight: 400,
  },
});

export const EntityTitle = styled("span")({
  fontWeight: "bold",
});

export const ChipList = styled(List)({
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  padding: 0,
  marginTop: 6,
});

export const PermChip = styled(Chip)({
  backgroundColor: "#e0e7ff",
  borderRadius: "8px",
  fontSize: "0.85rem",
  transition: "0.2s",
  "&:hover": {
    backgroundColor: "#d0dbff",
  },
});

export const SelectorBox = styled(Paper)({
  padding: 16,
  borderRadius: 12,
  background: "#ffffff",
});
