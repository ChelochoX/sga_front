import React, { useState } from "react";
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
  Collapse,
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
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  GppGood as PermisoIcon,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { drawerWidth, collapsedDrawerWidth } from "./Sidebar.styles";

interface SidebarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [configOpen, setConfigOpen] = useState(false);

  const handleConfigClick = () => setConfigOpen(!configOpen);

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
          boxShadow: 3,
          bgcolor: "background.paper",
          borderRight: "1px solid #ddd",
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
          px: 1,
        }}
      >
        <IconButton onClick={handleDrawerToggle}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
      <Divider />

      <List>
        {/* Personas */}
        <SidebarItem
          open={open}
          icon={<PeopleIcon />}
          label="Personas"
          to="/dashboard/personas"
          isMobile={isMobile}
          handleDrawerToggle={handleDrawerToggle}
        />
        {/* Usuarios */}
        <SidebarItem
          open={open}
          icon={<PersonIcon />}
          label="Usuarios"
          to="/dashboard/usuarios"
          isMobile={isMobile}
          handleDrawerToggle={handleDrawerToggle}
        />

        {/* Configuración (submenu) */}
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={handleConfigClick}
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
              <SettingsIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Configuración" />}
            {open && (configOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        <Collapse in={configOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <SidebarItem
              open={open}
              icon={<SecurityIcon />}
              label="Roles"
              to="/dashboard/roles"
              isMobile={isMobile}
              nested
              handleDrawerToggle={handleDrawerToggle}
            />
            <SidebarItem
              open={open}
              icon={<PermisoIcon />}
              label="Permisos"
              to="/dashboard/permisos"
              isMobile={isMobile}
              nested
              handleDrawerToggle={handleDrawerToggle}
            />
          </List>
        </Collapse>

        {/* Otros módulos */}
        <SidebarItem
          open={open}
          icon={<SchoolIcon />}
          label="Cursos"
          to="/dashboard/cursos"
          isMobile={isMobile}
          handleDrawerToggle={handleDrawerToggle}
        />
        <SidebarItem
          open={open}
          icon={<AssignmentIcon />}
          label="Inscripciones"
          to="/dashboard/inscripciones"
          isMobile={isMobile}
          handleDrawerToggle={handleDrawerToggle}
        />
        <SidebarItem
          open={open}
          icon={<PaymentIcon />}
          label="Pagos"
          to="/dashboard/pagos"
          isMobile={isMobile}
          handleDrawerToggle={handleDrawerToggle}
        />
        <SidebarItem
          open={open}
          icon={<AccountBalanceIcon />}
          label="Caja"
          to="/dashboard/caja"
          isMobile={isMobile}
          handleDrawerToggle={handleDrawerToggle}
        />
      </List>
    </Drawer>
  );
};

interface SidebarItemProps {
  open: boolean;
  icon: React.ReactElement;
  label: string;
  to: string;
  nested?: boolean;
  isMobile: boolean;
  handleDrawerToggle: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  open,
  icon,
  label,
  to,
  nested = false,
  isMobile,
  handleDrawerToggle,
}) => {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        component={NavLink}
        to={to}
        onClick={isMobile ? handleDrawerToggle : undefined}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: nested ? (open ? 4 : 2.5) : 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {icon}
        </ListItemIcon>
        {open && <ListItemText primary={label} />}
      </ListItemButton>
    </ListItem>
  );
};

export default Sidebar;
