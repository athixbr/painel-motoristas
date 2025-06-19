import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import Dashboard from './components/Dashboard';
import Relatorios from './components/Relatorios';
import Usuarios from './components/Usuarios';
import UsuarioDashboard from './components/UsuarioDashboard';
import Motoristas from './components/Motoristas';
import Produtos from './components/Produtos';

import ConferenciaPlacas from './components/ConferenciaPlacas';
import Login from './components/Login';
import Status from './components/Status';
import ControleEmbarque from './components/ControleEmbarque';
import DashbordPrincipal from './components/DashbordPrincipal';
import ControleEntradaProduto from './components/ControleEntradaProduto';
import CadastroMotorista from './components/CadastroMotorista';
import CadastroProdutor from './components/CadastroProdutor';
import StatusInterno from './components/StatusInterno';
import StatusExterno from './components/StatusExterno';

function App() {
  const [menuAberto, setMenuAberto] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === 'interno.coopergraos.com.br') navigate('/status-interno');
    else if (hostname === 'externo.coopergraos.com.br') navigate('/status-externo');
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Status />} />
      <Route path="/login" element={<Login />} />
      <Route path="/status-interno" element={<StatusInterno />} />
      <Route path="/status-externo" element={<StatusExterno />} />

      <Route element={<ProtectedRoute />}>
        <Route
    path="/*"
    element={
      <MainLayout menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
    }
  >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="DashbordPrincipal" element={<DashbordPrincipal />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="usuario-dashboard" element={<UsuarioDashboard />} />
          <Route path="motoristas" element={<Motoristas />} />
          <Route path="produtos" element={<Produtos />} />

          <Route path="conferencia-placas" element={<ConferenciaPlacas />} />
          <Route path="ControleEmbarque" element={<ControleEmbarque />} />
          <Route path="ControleEntrada" element={<ControleEntradaProduto />} />
          <Route path="CadastroMotorista" element={<CadastroMotorista />} />
          <Route path="CadastroProdutor" element={<CadastroProdutor />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
