import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.log('❌ Nenhum token encontrado, redirecionando para login.');
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    console.log("🔍 Validando token:", token);

    axios.get('https://api-motoristas.coopergraos.com.br/valida.php', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      console.log("🔍 Resposta do valida_token:", response.data);
      if (response.data.valid) {
        setIsAuthenticated(true);
      } else {
        console.log('❌ Token inválido, removendo...');
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }
    })
    .catch(error => {
      console.error('❌ Erro ao validar token:', error);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <Outlet />;
};

export default ProtectedRoute;
