import React from 'react';
import { Container, Typography } from '@mui/material';

function UsuarioDashboard() {
  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>
        Dashboard do Usuário
      </Typography>
      <Typography>
        Bem-vindo ao dashboard do usuário. Aqui você pode conferir as placas e alterar os status.
      </Typography>
    </Container>
  );
}

export default UsuarioDashboard;
