import React from "react";
import { Box } from "@mui/material";
import SidebarFilters from "./SideBarFilters";
import ServiceList from "./ServiceList";

export default function ServiceListPage() {
  return (
    <Box sx={{ display: "flex", padding: 2 }}>
      {/* Sidebar */}
      <Box sx={{ width: 240, marginRight: 4 }}>
        <SidebarFilters />
      </Box>

      {/* Service Results */}
      <Box sx={{ flexGrow: 1 }}>
        <ServiceList />
      </Box>
    </Box>
  );
}
