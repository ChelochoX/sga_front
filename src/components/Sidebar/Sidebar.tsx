// src/components/Sidebar/Sidebar.tsx
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Divider,
  useTheme,
} from "@mui/material";
import {
  People as PeopleIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { drawerStyles, drawerWidth, activeLinkStyle } from "./Sidebar.styles";

interface SidebarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

const menuItems = [
  { text: "Personas", icon: <PeopleIcon />, path: "/dashboard/personas" },
  { text: "Usuarios", icon: <PersonIcon />, path: "/dashboard/usuarios" },
  { text: "Roles", icon: <SecurityIcon />, path: "/dashboard/roles" },
  { text: "Cursos", icon: <SchoolIcon />, path: "/dashboard/cursos" },
  {
    text: "Inscripciones",
    icon: <AssignmentIcon />,
    path: "/dashboard/inscripciones",
  },
  { text: "Pagos", icon: <PaymentIcon />, path: "/dashboard/pagos" },
  { text: "Caja", icon: <AccountBalanceIcon />, path: "/dashboard/caja" },
];

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerClose }) => {
  const theme = useTheme();

  return (
    <Drawer sx={drawerStyles} variant="persistent" anchor="left" open={open}>
      <Toolbar>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <NavLink
            key={item.text}
            to={item.path}
            style={({ isActive }) =>
              isActive ? activeLinkStyle(theme) : undefined
            }
          >
            <ListItem button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
