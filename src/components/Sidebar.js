import React, { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemText, ListItemIcon,
  Drawer, Divider, IconButton, Tooltip
} from '@mui/material';
import {
  DirectionsCar as DirectionsCarIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  LocalShipping as LocalShippingIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Report as ReportIcon,
  ExitToApp as ExitToAppIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const drawerWidth = 260;

const Sidebar = () => {
  const navigate = useNavigate();
  const [nivelAcesso, setNivelAcesso] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const acesso = parseInt(localStorage.getItem('nivelAcesso'), 10);
    setNivelAcesso(acesso);

    const storedState = localStorage.getItem('sidebarOpen');
    setIsOpen(storedState === 'true');
  }, []);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarOpen', newState.toString());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nivelAcesso');
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      PaperProps={{ className: `sidebar-paper ${isOpen ? '' : 'collapsed'}` }}
    >
      <div className="sidebar-header">
        <IconButton onClick={handleToggle} className="sidebar-toggle-button">
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>

      <div className="sidebar-logo">
        {isOpen && (
          <img
            src="https://athix.com.br/img/bg_cooperfibra.png"
            alt="Logo"
            className="sidebar-logo-image"
          />
        )}
      </div>

      <Divider />

      <List>
        <Tooltip title="Painel" placement="right" disableHoverListener={isOpen}>
          <ListItem button component={Link} to="/dashboard" className="sidebar-item">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Painel" />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Cadastro de Motorista" placement="right" disableHoverListener={isOpen}>
          <ListItem button component={Link} to="/CadastroMotorista" className="sidebar-item">
            <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Cadastro de Motorista" />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Cadastro Produtor" placement="right" disableHoverListener={isOpen}>
          <ListItem button component={Link} to="/CadastroProdutor" className="sidebar-item">
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Cadastro Produtor" />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Controle de Embarque" placement="right" disableHoverListener={isOpen}>
          <ListItem button component={Link} to="/ControleEmbarque" className="sidebar-item">
            <ListItemIcon><LocalShippingIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Controle de Embarque" />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Controle de Entrada" placement="right" disableHoverListener={isOpen}>
          <ListItem button component={Link} to="/ControleEntrada" className="sidebar-item">
            <ListItemIcon><PlaylistAddCheckIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Controle de Entrada" />}
          </ListItem>
        </Tooltip>

        {nivelAcesso !== 2 && (
          <Tooltip title="Usuários" placement="right" disableHoverListener={isOpen}>
            <ListItem button component={Link} to="/usuarios" className="sidebar-item">
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              {isOpen && <ListItemText primary="Usuários" />}
            </ListItem>
          </Tooltip>
        )}

        <Tooltip title="Relatórios" placement="right" disableHoverListener={isOpen}>
          <ListItem button component={Link} to="/relatorios" className="sidebar-item">
            <ListItemIcon><ReportIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Relatórios" />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Sair" placement="right" disableHoverListener={isOpen}>
          <ListItem button onClick={handleLogout} className="sidebar-item logout-item">
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            {isOpen && <ListItemText primary="Sair" />}
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default Sidebar;
