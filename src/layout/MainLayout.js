import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ menuAberto, setMenuAberto }) => {
  const sidebarWidth = menuAberto ? 0 : 0;

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar ÚNICA */}
      <Sidebar menuAberto={menuAberto} setMenuAberto={setMenuAberto} />

      {/* Área de conteúdo */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: `calc(100% - ${sidebarWidth}px)`,
          ml: `${sidebarWidth}px`,
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header fixo */}
        <Header onToggleSidebar={() => setMenuAberto(!menuAberto)} />

        {/* Conteúdo principal */}
        <Box
          sx={{
            flexGrow: 1,
            mt: '64px',
            p: 3,
            overflowY: 'auto',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Outlet />
        </Box>

        {/* Rodapé */}
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
