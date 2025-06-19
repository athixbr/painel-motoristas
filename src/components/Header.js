import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Header = ({ pageTitle = 'Painel', onToggleSidebar }) => {
  const [userName, setUserName] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    navigate('/login');
  };

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    if (profile?.nome) setUserName(profile.nome);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Cuiaba',
      });
      setCurrentTime(time);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get('https://apiprevmet3.inmet.gov.br/previsao/78890000');
        const data = res.data['78890000'][new Date().toISOString().slice(0, 10)];
        setWeather({
          temp: `${data.manha.temp_min}°C / ${data.tarde.temp_max}°C`,
          description: data.manha.resumo,
        });
      } catch {
        setWeather({ temp: '24°C / 32°C', description: 'Parcialmente nublado' });
      }
    };
    fetchWeather();
  }, []);

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#34a853', height: 64 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onToggleSidebar} sx={{ display: { sm: 'inline-flex', md: 'none' }, color: 'white' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 500 }}>
            {pageTitle}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: '#FFCC00',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            <Typography sx={{ color: 'green', fontSize: '0.875rem' }}>
              {weather ? `${weather.temp} - ${weather.description}` : 'Carregando...'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ color: 'white' }} />
            <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>{currentTime}</Typography>
          </Box>

          <Tooltip title="Usuário logado">
            <Box
              sx={{
                backgroundColor: '#1B5E20',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.875rem',
              }}
            >
              {userName}
            </Box>
          </Tooltip>

          <Tooltip title="Sair">
            <IconButton onClick={handleLogout} sx={{ color: 'white' }}>
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
