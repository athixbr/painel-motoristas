import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Paper, Typography, Container } from '@mui/material';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// **Registrar elementos do ChartJS**
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [embarquesData, setEmbarquesData] = useState([]);
  const [produtosCount, setProdutosCount] = useState(0);
  const [statusData, setStatusData] = useState({});

  useEffect(() => {
    (async () => {
      await fetchEmbarques();
      await fetchProdutosCount();
      await fetchStatusCount();
    })();
  }, []);

  const fetchEmbarques = async () => {
    const response = await axios.get('https://api-motoristas.coopergraos.com.br/embarques.php');
    setEmbarquesData(response.data);
  };

  const fetchProdutosCount = async () => {
    const response = await axios.get('https://api-motoristas.coopergraos.com.br/produtos.php');
    setProdutosCount(response.data.length);
  };

  const fetchStatusCount = async () => {
    const response = await axios.get('https://api-motoristas.coopergraos.com.br/embarques.php');
    const counts = response.data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    setStatusData(counts);
  };

  const embarquesPorProduto = {
    labels: [...new Set(embarquesData.map((e) => e.produto))],
    datasets: [
      {
        label: 'Embarques por Produto',
        data: [...new Set(embarquesData.map((e) => e.produto))].map(
          (produto) => embarquesData.filter((e) => e.produto === produto).length
        ),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const statusChartData = {
    labels: Object.keys(statusData),
    datasets: [
      {
        label: 'Status dos Embarques',
        data: Object.values(statusData),
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
      },
    ],
  };

  const embarquesPorData = {
    labels: embarquesData.map((e) => new Date(e.data).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: 'Embarques por Data',
        data: embarquesData.map((e, index) => index + 1),
        backgroundColor: '#42A5F5',
      },
    ],
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Total de Produtos
                </Typography>
                <Typography variant="h3" color="primary" align="center">
                  {produtosCount}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Status dos Embarques
                </Typography>
                <Chart type="doughnut" data={statusChartData} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Embarques por Produto
                </Typography>
                <Chart type="bar" data={embarquesPorProduto} options={{ responsive: true }} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Embarques por Data
                </Typography>
                <Chart type="line" data={embarquesPorData} options={{ responsive: true }} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
