import React from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const menuItems = [
  { text: "Personas", icon: <PeopleIcon />, path: "/personas" },
  { text: "Usuarios", icon: <PersonIcon />, path: "/usuarios" },
  { text: "Roles", icon: <SecurityIcon />, path: "/roles" },
  { text: "Cursos", icon: <SchoolIcon />, path: "/cursos" },
  { text: "Inscripciones", icon: <AssignmentIcon />, path: "/inscripciones" },
  { text: "Pagos", icon: <PaymentIcon />, path: "/pagos" },
  { text: "Caja", icon: <AccountBalanceIcon />, path: "/caja" },
];

const Sidebar: React.FC = () => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={NavLink} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
