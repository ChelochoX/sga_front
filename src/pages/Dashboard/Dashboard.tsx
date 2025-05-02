import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Box } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box flexGrow={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
