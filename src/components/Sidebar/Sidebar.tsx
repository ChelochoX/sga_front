// src/components/Sidebar/Sidebar.tsx
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Divider,
  Toolbar,
  useTheme,
  useMediaQuery,
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
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { drawerWidth, collapsedDrawerWidth } from "./Sidebar.styles";

interface SidebarProps {
  open: boolean;
  handleDrawerToggle: () => void;
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

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={handleDrawerToggle}
      sx={{
        width: open ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedDrawerWidth,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
          alignItems: "center",
          px: [1],
        }}
      >
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
