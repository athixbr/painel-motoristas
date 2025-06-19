import React, { useState } from 'react';
import {
  Container, Grid, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, TablePagination
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function Motoristas() {
  const [drivers, setDrivers] = useState([
    { id: '12358', plate: 'NFN1321', driver: 'LEONIDIO', status: 'LIBERADO' },
    { id: '12357', plate: 'AUL8534', driver: 'JULIANO', status: 'LIBERADO' },
    { id: '12359', plate: 'ABC1234', driver: 'JOÃO', status: 'EM ANDAMENTO' },
    { id: '12360', plate: 'XYZ5678', driver: 'MARIA', status: 'LIBERADO' },
    { id: '12361', plate: 'DEF3456', driver: 'PEDRO', status: 'AGUARDANDO' },
    { id: '12362', plate: 'GHI7890', driver: 'CARLOS', status: 'LIBERADO' },
    { id: '12363', plate: 'JKL4321', driver: 'PAULO', status: 'LIBERADO' },
    { id: '12364', plate: 'MNO8765', driver: 'SILVIA', status: 'LIBERADO' },
    { id: '12365', plate: 'PQR9876', driver: 'ADRIANA', status: 'EM ANDAMENTO' },
    { id: '12366', plate: 'STU1234', driver: 'ROBERTO', status: 'AGUARDANDO' },
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Função para controlar a mudança de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Função para controlar a quantidade de linhas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Volta à primeira página sempre que mudar o número de linhas
  };

  return (
    <Container>
      <h2 style={{ color: '#1976d2', textAlign: 'center' }}>Gerenciamento de Motoristas</h2>
      {/* Formulário para adicionar novos motoristas */}
      <Grid container spacing={2} sx={{ my: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nome do Motorista"
            name="driver"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Placa"
            name="plate"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Status"
            name="status"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Cadastrar
          </Button>
        </Grid>
      </Grid>

      {/* Tabela de motoristas */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="Motoristas">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>PLACA</TableCell>
              <TableCell>NOME DO MOTORISTA</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.id}</TableCell>
                <TableCell>{driver.plate}</TableCell>
                <TableCell>{driver.driver}</TableCell>
                <TableCell>{driver.status}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Paginação */}
        <TablePagination
          component="div"
          count={drivers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 50]} // Opções de resultados por página
        />
      </Paper>
    </Container>
  );
}

export default Motoristas;
