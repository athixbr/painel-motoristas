import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true }); // Usa replace para não manter a URL no histórico
  }, [navigate]);

  return null; // Não renderiza nada
};

export default RedirectToHome;
