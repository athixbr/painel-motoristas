import React, { useState } from 'react';
import {
  Container, Grid, TextField, Button, Paper, Tabs, Tab, Box, Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, AppBar, Toolbar
} from '@mui/material'; // Importando AppBar e Toolbar
import { format } from 'date-fns';

function ConferenciaPlacas({ currentUser }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [tabValue, setTabValue] = useState(0);
  const [embarque, setEmbarque] = useState({ data: today, placa: '', motorista: '', status: '', empresa: '', produto: 'MILHO' });
  const [entradaProduto, setEntradaProduto] = useState({ data: today, produtor: '', motorista: '', placa: '', produto: 'MILHO' });
  const [embarqueData, setEmbarqueData] = useState([]);
  const [entradaProdutoData, setEntradaProdutoData] = useState([]);
  const [savedBy, setSavedBy] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({ motorista: '', placa: '' }); // Filtros

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Verifica se currentUser está definido
  const getUsername = () => (currentUser && currentUser.username) ? currentUser.username : "Usuário Desconhecido";

  const handleSaveEmbarque = () => {
    const username = getUsername();
    
    setEmbarqueData([...embarqueData, { ...embarque, savedBy: username }]);
    setSavedBy(username);
    alert(`Embarque salvo com sucesso por ${username}`);
  };

  const handleSaveEntrada = () => {
    const username = getUsername();

    setEntradaProdutoData([...entradaProdutoData, { ...entradaProduto, savedBy: username }]);
    setSavedBy(username);
    alert(`Entrada de produto salva com sucesso por ${username}`);
  };

  const handleMultiSelect = () => {
    setOpenDialog(true); // Abre o modal de confirmação
  };

  const handleConfirm = () => {
    setOpenDialog(false);
    alert('Todos os registros selecionados foram liberados!');
  };

  const produtores = ['Produtor 1', 'Produtor 2', 'Produtor 3'];
  const motoristasExemplo = ['Motorista A', 'Motorista B', 'Motorista C'];

  // Lógica de Filtro
  const filteredEmbarqueData = embarqueData.filter(row =>
    row.motorista.toLowerCase().includes(filters.motorista.toLowerCase()) &&
    row.placa.toLowerCase().includes(filters.placa.toLowerCase())
  );

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <Container>
   

      <h2 style={{ textAlign: 'center', color: '#1976d2' }}>Conferência de Placas</h2>

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Controle de Embarque" />
        <Tab label="Entrada de Produto" />
      </Tabs>

      {/* Tab Controle de Embarque */}
      <Box hidden={tabValue !== 0}>
        <Paper sx={{ p: 4, mt: 2, mb: 4 }}>
          <h3>Controle de Embarque</h3>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data"
                fullWidth
                type="date"
                value={embarque.data}
                onChange={(e) => setEmbarque({ ...embarque, data: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Placa"
                fullWidth
                value={embarque.placa}
                onChange={(e) => setEmbarque({ ...embarque, placa: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={motoristasExemplo}
                renderInput={(params) => <TextField {...params} label="Nome do Motorista" required />}
                value={embarque.motorista}
                onChange={(event, newValue) => setEmbarque({ ...embarque, motorista: newValue })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Empresa"
                fullWidth
                value={embarque.empresa}
                onChange={(e) => setEmbarque({ ...embarque, empresa: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                fullWidth
                value={embarque.status}
                onChange={(e) => setEmbarque({ ...embarque, status: e.target.value })}
                required
              >
                <MenuItem value="Liberado para Pesar">Liberado para Pesar</MenuItem>
                <MenuItem value="Processo em Andamento">Processo em Andamento</MenuItem>
                <MenuItem value="Liberado - Buscar NF-e">Liberado - Buscar NF-e</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Produto"
                fullWidth
                value={embarque.produto}
                onChange={(e) => setEmbarque({ ...embarque, produto: e.target.value })}
                required
              >
                <MenuItem value="MILHO">MILHO</MenuItem>
                <MenuItem value="SOJA">SOJA</MenuItem>
                <MenuItem value="RESÍDUO">RESÍDUO</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSaveEmbarque}>
                Salvar Embarque
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filtros da tabela */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            label="Filtrar por Motorista"
            value={filters.motorista}
            onChange={(e) => setFilters({ ...filters, motorista: e.target.value })}
          />
          <TextField
            label="Filtrar por Placa"
            value={filters.placa}
            onChange={(e) => setFilters({ ...filters, placa: e.target.value })}
          />
        </Box>

        {/* Tabela de Embarque */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < filteredEmbarqueData.length}
                    checked={filteredEmbarqueData.length > 0 && selectedRows.length === filteredEmbarqueData.length}
                    onChange={(e) => setSelectedRows(e.target.checked ? filteredEmbarqueData.map(row => row.id) : [])}
                  />
                </TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Placa</TableCell>
                <TableCell>Motorista</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Salvo por</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmbarqueData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </TableCell>
                  <TableCell>{row.data}</TableCell>
                  <TableCell>{row.placa}</TableCell>
                  <TableCell>{row.motorista}</TableCell>
                  <TableCell>{row.empresa}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.produto}</TableCell>
                  <TableCell>{row.savedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button variant="contained" color="primary" onClick={handleMultiSelect} sx={{ mt: 2 }}>
          Liberar Selecionados
        </Button>
      </Box>

      {/* Tab Entrada de Produto */}
      <Box hidden={tabValue !== 1}>
        <Paper sx={{ p: 4, mt: 2, mb: 4 }}>
          <h3>Entrada de Produto</h3>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data"
                fullWidth
                type="date"
                value={entradaProduto.data}
                onChange={(e) => setEntradaProduto({ ...entradaProduto, data: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={produtores}
                renderInput={(params) => <TextField {...params} label="Produtor" required />}
                value={entradaProduto.produtor}
                onChange={(event, newValue) => setEntradaProduto({ ...entradaProduto, produtor: newValue })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={motoristasExemplo}
                renderInput={(params) => <TextField {...params} label="Nome do Motorista" required />}
                value={entradaProduto.motorista}
                onChange={(event, newValue) => setEntradaProduto({ ...entradaProduto, motorista: newValue })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Placa"
                fullWidth
                value={entradaProduto.placa}
                onChange={(e) => setEntradaProduto({ ...entradaProduto, placa: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Produto"
                fullWidth
                value={entradaProduto.produto}
                onChange={(e) => setEntradaProduto({ ...entradaProduto, produto: e.target.value })}
                required
              >
                <MenuItem value="MILHO">MILHO</MenuItem>
                <MenuItem value="SOJA">SOJA</MenuItem>
                <MenuItem value="RESÍDUO">RESÍDUO</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSaveEntrada}>
                Salvar Entrada de Produto
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabela de Entrada de Produto */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Produtor</TableCell>
                <TableCell>Motorista</TableCell>
                <TableCell>Placa</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Salvo por</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entradaProdutoData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>{row.data}</TableCell>
                  <TableCell>{row.produtor}</TableCell>
                  <TableCell>{row.motorista}</TableCell>
                  <TableCell>{row.placa}</TableCell>
                  <TableCell>{row.produto}</TableCell>
                  <TableCell>{row.savedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal de Confirmação */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Liberação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja liberar todos os registros selecionados?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleConfirm} color="primary">Confirmar</Button>
        </DialogActions>
      </Dialog>

      {savedBy && (
        <Paper sx={{ p: 4 }}>
          <h4>Status alterado por {savedBy}</h4>
        </Paper>
      )}
    </Container>
  );
}

export default ConferenciaPlacas;
