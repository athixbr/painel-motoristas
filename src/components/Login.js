import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Snackbar, Alert, CircularProgress, Typography, Paper
} from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

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

  const handleCloseSnackbar = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api-motoristas.coopergraos.com.br/valida.php',
        { email, senha },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userProfile', JSON.stringify(response.data));
        setSuccessMessage('Login bem-sucedido! Redirecionando...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setErrorMessage(response.data.message || 'Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        padding: 2,
        position: 'relative'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
            animation: 'fadeIn 1s ease-in-out'
          }}
        >
          <Box
            component="img"
            src="https://athix.com.br/img/bg_cooperfibra.png"
            alt="Logo do Sistema"
            sx={{ width: 120, height: 'auto', margin: '0 auto 16px' }}
          />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Acesso ao Painel de Motoristas
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Digite suas credenciais para continuar
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Usuário"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              variant="outlined"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="success"
              type="submit"
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Entrar'}
            </Button>
          </form>
        </Paper>
      </Box>

      {/* Rodapé com créditos */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Desenvolvido por{' '}
          <a href="https://www.athix.com.br" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
            ATHIX
          </a>
        </Typography>
      </Box>

      {/* Botão flutuante TomTicket POSICIONADO ACIMA */}
      <Box
        onClick={() => window.open('https://athix.tomticket.com?account=4348160P22012025012106', '_blank')}
        sx={{
          position: 'fixed',
          bottom: 96, // acima do botão do chat
          right: 24,
          backgroundColor: '#F0B429',
          color: 'white',
          borderRadius: '50%',
          width: 45, // 20% menor
          height: 45,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1300,
          pointerEvents: 'auto',
        }}
      >
        <SupportAgentIcon sx={{ fontSize: 24 }} />
      </Box>

      {/* Snackbars */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Animação */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default Login;
