import React, { useState, useEffect } from 'react';
import {
  Container, Grid, TextField, Button, Paper, Typography, MenuItem, Box, Autocomplete
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Relatorios = () => {
  const [tipo, setTipo] = useState('controle_embarque');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [produto, setProduto] = useState('');
  const [motorista, setMotorista] = useState('');
  const [placa, setPlaca] = useState('');
  const [transportadora, setTransportadora] = useState('');
  const [produtor, setProdutor] = useState('');
  const [dados, setDados] = useState([]);
  const [produtosOptions, setProdutosOptions] = useState([]);
  const [motoristasOptions, setMotoristasOptions] = useState([]);
const [produtoresOptions, setProdutoresOptions] = useState([]);

  useEffect(() => {
    // Buscar lista de produtos
    axios.get('https://api-motoristas.coopergraos.com.br/relatorios.php?action=listar_produtos')
      .then(response => {
        setProdutosOptions(response.data.produtos || []);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  }, []);

  const fetchMotoristas = (termo) => {
    if (termo.length < 2) return;
    axios.get('https://api-motoristas.coopergraos.com.br/relatorios.php?action=buscar_motoristas', {
      params: { q: termo }
    })
      .then(response => {
        setMotoristasOptions(response.data.motoristas || []);
      })
      .catch(error => {
        console.error('Erro ao buscar motoristas:', error);
      });
  };

  const fetchProdutores = (termo) => {
  if (termo.length < 2) return;
  axios.get('https://api-motoristas.coopergraos.com.br/relatorios.php?action=buscar_produtores', {
    params: { q: termo }
  })
    .then(response => {
      setProdutoresOptions(response.data.produtores || []);
    })
    .catch(error => {
      console.error('Erro ao buscar produtores:', error);
    });
};

  const fetchRelatorios = async () => {
    const base = 'https://api-motoristas.coopergraos.com.br/relatorios.php';
    const filtros = {
      data_ini: dataInicial,
      data_fim: dataFinal,
      produto,
      motorista,
      placas: placa,
      transportadora,
      produtor
    };

    try {
      const { data } = await axios.get(base, {
        params: { action: tipo, ...filtros }
      });

      const lista = tipo === 'controle_embarque'
        ? data.relatorio_embarque
        : data.relatorio_entrada;

      const processada = lista.map((item, i) => ({
        id: i + 1,
        ...item,
        data: dayjs(item.data).format('DD/MM/YYYY')
      }));

      setDados(processada);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

const exportarPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const titulo = tipo === 'controle_embarque' ? 'Controle de Embarque' : 'Controle de Entrada de Produtos';

  const logoPath = `${window.location.origin}/logo-cooper.png`;
  const larguraPagina = doc.internal.pageSize.getWidth();

  // Cabeçalho + Logo
  doc.setFontSize(16);
  doc.text(titulo, 14, 20);
  doc.addImage(logoPath, 'PNG', larguraPagina - 35, 10, 35, 20); // topo direito

  autoTable(doc, {
    startY: 35,
    head: [Object.keys(dados[0] || {})],
    body: dados.map(row => Object.values(row)),
    styles: {
      fontSize: 10,
      cellPadding: 2,
      halign: 'center',
    },
    headStyles: {
      fillColor: [240, 240, 240], // cinza claro
      textColor: 0,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    didDrawPage: function (data) {
      // Rodapé com nome do sistema
      doc.setFontSize(10);
      doc.text('Painel de Motoristas - Coopergraos', 14, doc.internal.pageSize.getHeight() - 10);

      // Paginação no canto direito
      const pageNumber = doc.internal.getNumberOfPages();
      doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${pageNumber}`, larguraPagina - 40, doc.internal.pageSize.getHeight() - 10);
    }
  });

  doc.save(`${titulo}.pdf`);
};

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tipo);
    XLSX.writeFile(wb, `${tipo}.xlsx`);
  };

  const colunasComuns = [
    { field: 'data', headerName: 'Data', width: 120 },
    { field: 'produto', headerName: 'Produto', width: 180 },
    { field: 'motorista', headerName: 'Motorista', width: 180 },
    { field: 'placas', headerName: 'Placa', width: 120 }
  ];

  const colunasEspecificas = tipo === 'controle_embarque'
    ? [
        { field: 'transportadora', headerName: 'Transportadora', width: 200 },
        { field: 'empresa', headerName: 'Empresa', width: 180 },
        { field: 'nfe', headerName: 'NFe', width: 150 },
        { field: 'status', headerName: 'Status', width: 150 }
      ]
    : [
        { field: 'produtor', headerName: 'Produtor', width: 200 },
        { field: 'hora_chegada', headerName: 'Chegada', width: 100 },
        { field: 'hora_entrada', headerName: 'Entrada', width: 100 },
        { field: 'hora_saida', headerName: 'Saída', width: 100 }
      ];

  return (
    <Box sx={{ px: 2 }}>
      

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              select fullWidth label="Tipo de Relatório" value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <MenuItem value="controle_embarque">Controle de Embarque</MenuItem>
              <MenuItem value="controle_entrada">Controle de Entrada</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Data Inicial" type="date" fullWidth InputLabelProps={{ shrink: true }}
              value={dataInicial} onChange={(e) => setDataInicial(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Data Final" type="date" fullWidth InputLabelProps={{ shrink: true }}
              value={dataFinal} onChange={(e) => setDataFinal(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={produtosOptions}
              value={produto}
              onChange={(event, newValue) => setProduto(newValue)}
              renderInput={(params) => <TextField {...params} label="Produto" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              freeSolo
              options={motoristasOptions}
              value={motorista}
              onInputChange={(event, newInputValue) => {
                setMotorista(newInputValue);
                fetchMotoristas(newInputValue);
              }}
              renderInput={(params) => <TextField {...params} label="Motorista" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField label="Placa" fullWidth value={placa} onChange={(e) => setPlaca(e.target.value)} />
          </Grid>
          {tipo === 'controle_embarque' && (
            <Grid item xs={12} sm={3}>
              <TextField label="Transportadora" fullWidth value={transportadora} onChange={(e) => setTransportadora(e.target.value)} />
            </Grid>
          )}
          {tipo === 'controle_entrada' && (
  <Grid item xs={12} sm={3}>
    <Autocomplete
      freeSolo
      options={produtoresOptions}
      value={produtor}
      onInputChange={(event, newInputValue) => {
        setProdutor(newInputValue);
        fetchProdutores(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} label="Produtor" fullWidth />}
    />
  </Grid>
)}

          <Grid item xs={12} sm={3}>
            <Button variant="contained" fullWidth onClick={fetchRelatorios}>Buscar</Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela */}
      <Paper sx={{ height: 500, width: '100%', mb: 2 }}>
        <DataGrid rows={dados} columns={[{ field: 'id', headerName: '#', width: 50 }, ...colunasComuns, ...colunasEspecificas]} pageSize={10} />
      </Paper>

      {/* Botões de exportação */}
    <Box sx={{ mb: '180px' }}>
  <Grid container spacing={2} justifyContent="flex-end">
    <Grid item>
      <Button variant="outlined" color="primary" onClick={exportarPDF}>
        Exportar PDF
      </Button>
    </Grid>
    <Grid item>
      <Button variant="outlined" color="success" onClick={exportarExcel}>
        Exportar Excel
      </Button>
    </Grid>
  </Grid>
</Box>

    </Box>
  );
};

export default Relatorios;
