import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, TextField, Box, Modal, Typography, IconButton, InputAdornment,
  Snackbar, Alert
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import InputMask from 'react-input-mask';
import { MaterialReactTable } from 'material-react-table';
import { Close } from '@mui/icons-material';


const CadastroMotorista = () => {
  const [motoristas, setMotoristas] = useState([]);
  const [currentMotorista, setCurrentMotorista] = useState(null);
  const [modalType, setModalType] = useState('visualizar');
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [nivelAcesso, setNivelAcesso] = useState(null);

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    setNivelAcesso(userProfile ? userProfile.nivelAcesso : null);
    fetchMotoristas();
  }, []);

  const fetchMotoristas = async () => {
    try {
      const response = await axios.get('https://api-motoristas.coopergraos.com.br/motoristas.php');
      setMotoristas(response.data);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
    }
  };

  const handleOpenModal = (type, motorista = null) => {
    setModalType(type);
    setCurrentMotorista(
      motorista || {
        nome: '',
        placa: '',
        empresa: '',
        telefone: '',
      }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleMotoristaChange = (e) => {
    const { name, value } = e.target;
    setCurrentMotorista({ ...currentMotorista, [name]: value });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSalvarMotorista = async () => {
    const isDuplicate = motoristas.some(
      (mot) =>
        (mot.nome === currentMotorista.nome ||
          mot.placa === currentMotorista.placa ||
          mot.telefone === currentMotorista.telefone) &&
        mot.id !== currentMotorista.id
    );

    if (isDuplicate) {
      showSnackbar("Nome, Placa ou Telefone já cadastrados!", "error");
      return;
    }

    try {
      if (modalType === 'editar') {
        await axios.put('https://api-motoristas.coopergraos.com.br/motoristas.php', currentMotorista);
      } else {
        const response = await axios.post('https://api-motoristas.coopergraos.com.br/motoristas.php', currentMotorista);
        if (!response.data.success) {
          showSnackbar(response.data.error || "Erro ao salvar motorista", "error");
          return;
        }
      }
      
      fetchMotoristas();
      handleCloseModal();
      showSnackbar("Motorista salvo com sucesso!", "success");
    } catch (error) {
      console.error('Erro ao salvar motorista:', error);
      showSnackbar("Erro ao salvar motorista", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('https://api-motoristas.coopergraos.com.br/motoristas.php', { data: { id } });
      fetchMotoristas();
      showSnackbar("Motorista excluído com sucesso!", "success");
    } catch (error) {
      console.error('Erro ao excluir motorista:', error);
      showSnackbar("Erro ao excluir motorista", "error");
    }
  };

  // Configuração das colunas para Material React Table
  const columns = [
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'placa', header: 'Placa' },
    { accessorKey: 'telefone', header: 'Telefone' },
    {
      accessorKey: 'acoes',
      header: 'Ações',
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <>
          <IconButton onClick={() => handleOpenModal('visualizar', row.original)}><Visibility /></IconButton>
          <IconButton onClick={() => handleOpenModal('editar', row.original)}><Edit /></IconButton>
          {nivelAcesso !== 2 && (
            <IconButton onClick={() => handleDelete(row.original.id)}><Delete /></IconButton>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, p: 7 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal('adicionar')}
            sx={{ mb: 2 }}
          >
            Adicionar Motorista
          </Button>

          {/* Tabela com filtros e paginação */}
          <MaterialReactTable
            columns={columns}
            data={motoristas}
            enableColumnFilters
            enablePagination
            initialState={{ pagination: { pageSize: 25 } }}
          />

          {/* Modal de Cadastro/Edição */}
          <Modal open={openModal} onClose={handleCloseModal}>
          <Box
    sx={{
      position: 'relative',
      width: '80%',
      maxWidth: 600,
      margin: 'auto',
      mt: 10,
      p: 3,
      backgroundColor: 'white',
      borderRadius: 2,
      boxShadow: 24,
    }}
  >            <IconButton
      onClick={handleCloseModal}
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        color: 'black', //  visibilidade
      }}
    >
      <Close />
    </IconButton>
              <Typography variant="h6">
                {modalType === 'adicionar' ? 'Adicionar Motorista' : 'Editar Motorista'}
              </Typography>
              
              <TextField label="Nome" name="nome" value={currentMotorista?.nome} onChange={handleMotoristaChange} fullWidth margin="normal" />
              <TextField label="Placa" name="placa" value={currentMotorista?.placa} onChange={handleMotoristaChange} fullWidth margin="normal" />
              <InputMask mask="(99) 99999-9999" value={currentMotorista?.telefone} onChange={handleMotoristaChange}>
                {() => <TextField label="Telefone" name="telefone" fullWidth margin="normal" />}
              </InputMask>
              <Button variant="contained" onClick={handleSalvarMotorista} sx={{ mt: 2 }}>Salvar</Button>
            </Box>
          </Modal>

          {/* Notificação de sucesso ou erro */}
          <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
            <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};

export default CadastroMotorista;
