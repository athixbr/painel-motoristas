import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Box, Divider } from '@mui/material';
import { Dashboard as DashboardIcon, DirectionsCar as ConferenciaIcon, ExitToApp as SairIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function SidebarUsuario() {
  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: '#f2f2f2',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <List>
        <ListItem button component={Link} to="/usuario-dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/conferencia-placas">
          <ListItemIcon>
            <ConferenciaIcon />
          </ListItemIcon>
          <ListItemText primary="Conferencia" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <SairIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
      </List>
    </Box>
  );
}

export default SidebarUsuario;
