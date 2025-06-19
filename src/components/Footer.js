import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const useStyles = {
  footer: {
    backgroundColor: 'transparent', // Fundo transparente
    textAlign: 'center',
    padding: '16px',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 999,
  },
  floatingWhatsApp: {
    position: 'fixed',
    bottom: '35px',
    right: '20px',
    backgroundColor: '#25D366',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    zIndex: 1000,
  },
};

const Footer = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5566999960422', '_blank');
  };

  return (
    <>
      {/* Footer com texto */}
      <Box sx={useStyles.footer}>
        <Typography variant="body2">
          Desenvolvido por{' '}
          <Link href="https://www.athix.com.br" target="_blank" color="inherit">
            ATHIX
          </Link>
        </Typography>
      </Box>

      {/* Botão Flutuante do WhatsApp */}
      <Box sx={useStyles.floatingWhatsApp} onClick={handleWhatsAppClick}>
        <WhatsAppIcon sx={{ color: '#FFFFFF', fontSize: '32px' }} />
      </Box>
    </>
  );
};

export default Footer;