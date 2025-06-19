import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const Footer = () => {
  useEffect(() => {
    const script = document.createElement('script');
    document.tomticketChatLoaderScriptVersion = 2;
    script.type = 'text/javascript';
    script.async = true;
    script.src =
      'https://athix.tomticket.com/scripts-chat/chat.min.js' +
      '?id=EP67940' +
      '&account=4348160P22012025012106' +
      '&autoOpen=0' +
      '&hideWhenOffline=0' +
      '&d=athix' +
      '&ts=' + new Date().getTime() +
      '&ref=' + encodeURIComponent(window.location.href);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>


      {/* Botão flutuante do suporte POSICIONADO ACIMA do chat */}
      <Box
        onClick={() =>
          window.open(
            'https://athix.tomticket.com?account=4348160P22012025012106',
            '_blank'
          )
        }
        sx={{
          position: 'fixed',
          bottom: 96,
          right: 24,
          backgroundColor: '#F0B429',
          color: 'white',
          borderRadius: '50%',
          width: 45, // 20% menor que 56
          height: 45,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1300,
          pointerEvents: 'auto', // <-- Permite clique
        }}
      >
        <SupportAgentIcon sx={{ fontSize: 24 }} />
      </Box>
    </>
  );
};

export default Footer;
