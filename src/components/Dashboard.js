import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Paper, Typography, TextField, Button
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const DashboardNovo = () => {
  const [filtros, setFiltros] = useState({
    data_ini: '',
    data_fim: '',
    produto: '',
    motorista: '',
    placa: '',
    transportadora: '',
    produtor: ''
  });

  const [dados, setDados] = useState({
    total_motoristas: 0,
    total_produtores: 0,
    total_embarques: 0,
    total_entradas: 0,
    embarques_por_produto: [],
    distribuicao_status_embarque: [],
    ranking_produtos_entrada: []
  });

  const apiUrl = 'https://api-motoristas.coopergraos.com.br/dash.php';

  const fetchDados = async () => {
    const endpoints = [
      'total_motoristas',
      'total_produtores',
      'total_embarques_por_produto',
      'distribuicao_status_embarque',
      'ranking_produtos_entrada'
    ];

    try {
      const responses = await Promise.all(
        endpoints.map(action => axios.get(apiUrl, { params: { action, ...filtros } }))
      );

      const embarquesTotais = responses[2].data.reduce((acc, item) => acc + parseInt(item.total), 0);
      const entradasTotais = responses[4].data.reduce((acc, item) => acc + parseInt(item.total), 0);

      setDados({
        total_motoristas: responses[0].data.total_motoristas,
        total_produtores: responses[1].data.total_produtores,
        total_embarques: embarquesTotais,
        total_entradas: entradasTotais,
        embarques_por_produto: responses[2].data,
        distribuicao_status_embarque: responses[3].data,
        ranking_produtos_entrada: responses[4].data
      });
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleChangeFiltro = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const gerarGraficoBarra = (labels, valores, titulo, cor = '#1976d2') => ({
    labels,
    datasets: [{ label: titulo, data: valores, backgroundColor: cor }]
  });

  const gerarGraficoPizza = (labels, valores) => ({
    labels,
    datasets: [{
      label: 'Status',
      data: valores,
      backgroundColor: ['#2e7d32', '#f9a825', '#c62828', '#6a1b9a']
    }]
  });

  const kpis = [
    { label: 'Total de Motoristas', valor: dados.total_motoristas, cor: 'success.main' },
    { label: 'Total de Produtores', valor: dados.total_produtores, cor: 'primary.main' },
    { label: 'Total de Embarques', valor: dados.total_embarques, cor: 'info.main' },
    { label: 'Total de Entradas', valor: dados.total_entradas, cor: 'warning.main' }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Filtros */}
     
      {/* KPIs */}
      <Grid container spacing={3} justifyContent="center">
        {kpis.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h3" color={item.cor}>
                {item.valor}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos: 3 por linha */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Embarques por Produto</Typography>
            <Bar
              data={gerarGraficoBarra(
                dados.embarques_por_produto.map(item => item.produto),
                dados.embarques_por_produto.map(item => item.total),
                'Embarques'
              )}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Distribuição de Status de Embarque</Typography>
            <Pie
              data={gerarGraficoPizza(
                dados.distribuicao_status_embarque.map(i => i.status || 'Indefinido'),
                dados.distribuicao_status_embarque.map(i => i.total)
              )}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Ranking de Produtos de Entrada</Typography>
            <Bar
              data={gerarGraficoBarra(
                dados.ranking_produtos_entrada.map(item => item.produto),
                dados.ranking_produtos_entrada.map(item => item.total),
                'Entradas'
              )}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardNovo;
