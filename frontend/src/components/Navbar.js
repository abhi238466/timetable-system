import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

function Navbar() {

  return (
    <AppBar position="static" sx={{ background: "#34495e" }}>
      <Toolbar>
        <Typography variant="h6">
          Smart Classroom Allocation System
        </Typography>
      </Toolbar>
    </AppBar>
  );

}

export default Navbar;