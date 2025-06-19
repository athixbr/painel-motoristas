import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Box,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsCar as DirectionsCarIcon,
  People as PeopleIcon,
  LocalShipping as LocalShippingIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Report as ReportIcon,
  ExitToApp as ExitToAppIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const Sidebar = ({ menuAberto, setMenuAberto }) => {
  const navigate = useNavigate();
  const [nivelAcesso, setNivelAcesso] = useState(null);

  useEffect(() => {
    const acesso = parseInt(localStorage.getItem('nivelAcesso'), 10);
    setNivelAcesso(acesso);
  }, []);

  const drawerWidth = menuAberto ? 250 : 80;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nivelAcesso');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Painel', icon: <DashboardIcon />, to: '/dashboard' },
    { text: 'Cadastro de Motorista', icon: <DirectionsCarIcon />, to: '/CadastroMotorista' },
    { text: 'Cadastro Produtor', icon: <PeopleIcon />, to: '/CadastroProdutor' },
    { text: 'Cadastro de Produtos', icon: <Inventory2Icon />, to: '/produtos' },

    { text: 'Controle de Embarque', icon: <LocalShippingIcon />, to: '/ControleEmbarque' },
    { text: 'Controle de Entrada', icon: <PlaylistAddCheckIcon />, to: '/ControleEntrada' },
    { text: 'Relatórios', icon: <ReportIcon />, to: '/relatorios' },
    ...(nivelAcesso !== 2 ? [{ text: 'Usuários', icon: <PeopleIcon />, to: '/usuarios' }] : []),
    { text: 'Sair', icon: <ExitToAppIcon />, action: handleLogout },
  ];

  return (
    <Drawer
      variant="permanent"
      open={menuAberto}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: 'width 0.3s',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          background: '#1B1F23',
          color: 'white',
          borderRight: 'none',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Espaço do Header */}
      <Box sx={{ height: '55px' }} />

      {/* Botão de Encolher */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: menuAberto ? 'flex-end' : 'center',
          px: 1,
          pb: 1,
        }}
      >
        <IconButton onClick={() => setMenuAberto(!menuAberto)} sx={{ color: 'white' }}>
          {menuAberto ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* LOGO */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          mb: 2,
        }}
      >
        <img
          src="https://athix.com.br/img/bg_cooperfibra.png"
          alt="Logo"
          style={{
            width: menuAberto ? '120px' : '40px',
            transition: 'all 0.3s',
          }}
        />
      </Box>

      <Divider sx={{ borderColor: '#333' }} />

      {/* MENU */}
      <List>
        {menuItems.map(({ text, icon, to, action }, idx) => (
          <Tooltip title={!menuAberto ? text : ''} placement="right" key={idx}>
            <ListItem
              button
              component={to ? Link : 'button'}
              to={to}
              onClick={action}
              sx={{
                py: 1.5,
                px: 2,
                '&:hover': {
                  backgroundColor: '#2E3A45',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'white',
                  minWidth: 0,
                  mr: menuAberto ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </ListItemIcon>
              {menuAberto && <ListItemText primary={text} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
