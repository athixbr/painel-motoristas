import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Box, Divider } from '@mui/material';
import { Dashboard as DashboardIcon, DirectionsCar as MotoristasIcon, BarChart as RelatoriosIcon, Settings as ConfiguracoesIcon, ExitToApp as SairIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function SidebarAdmin() {
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
        <ListItem button component={Link} to="/admin-dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button component={Link} to="/motoristas">
          <ListItemIcon>
            <MotoristasIcon />
          </ListItemIcon>
          <ListItemText primary="Motoristas" />
        </ListItem>

        <ListItem button component={Link} to="/relatorios">
          <ListItemIcon>
            <RelatoriosIcon />
          </ListItemIcon>
          <ListItemText primary="Relatórios" />
        </ListItem>

        <ListItem button component={Link} to="/configuracoes">
          <ListItemIcon>
            <ConfiguracoesIcon />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
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

export default SidebarAdmin;
