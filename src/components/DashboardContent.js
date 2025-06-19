import React, { useState } from 'react';
import {
  Container, Grid, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Modal, Box, IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function DashboardContent() {
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
    { id: '12366', plate: 'STU1234', driver: 'ROBERTO', status: 'AGUARDANDO' }
  ]);

  const [newDriver, setNewDriver] = useState({ id: '', plate: '', driver: '', status: '' });
  const [openModal, setOpenModal] = useState(false); // Estado para abrir/fechar modal
  const [editDriver, setEditDriver] = useState(null); // Estado para armazenar o motorista a ser editado

  const handleChange = (e) => {
    setNewDriver({ ...newDriver, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDrivers([...drivers, { ...newDriver, id: Date.now().toString() }]);
    setNewDriver({ id: '', plate: '', driver: '', status: '' });
  };

  const handleEditClick = (driver) => {
    setEditDriver(driver);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setEditDriver(null);
  };

  const handleEditChange = (e) => {
    setEditDriver({ ...editDriver, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = () => {
    setDrivers(drivers.map((d) => (d.id === editDriver.id ? editDriver : d)));
    setOpenModal(false);
    setEditDriver(null);
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
            value={newDriver.driver}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Placa"
            name="plate"
            fullWidth
            value={newDriver.plate}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Status"
            name="status"
            fullWidth
            value={newDriver.status}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
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
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.id}</TableCell>
                <TableCell>{driver.plate}</TableCell>
                <TableCell>{driver.driver}</TableCell>
                <TableCell>{driver.status}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditClick(driver)}>
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
      </Paper>

      {/* Modal de edição */}
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Editar Motorista</h2>
          {editDriver && (
            <>
              <TextField
                label="Nome do Motorista"
                name="driver"
                fullWidth
                value={editDriver.driver}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Placa"
                name="plate"
                fullWidth
                value={editDriver.plate}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Status"
                name="status"
                fullWidth
                value={editDriver.status}
                onChange={handleEditChange}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                Salvar
              </Button>
            </>
          )}
        </Box>
      </Modal>

    
    </Container>
  );
}

export default DashboardContent;
