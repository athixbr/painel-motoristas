import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, TextField, Box, Modal, Typography, 
  IconButton, InputAdornment, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete, Visibility, Close, Search } from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table';

const CadastroProdutor = () => {
  const [produtores, setProdutores] = useState([]);
  const [currentProdutor, setCurrentProdutor] = useState(null);
  const [modalType, setModalType] = useState('visualizar');
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [nivelAcesso, setNivelAcesso] = useState(null);

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    setNivelAcesso(userProfile ? userProfile.nivelAcesso : null);
    fetchProdutores();
  }, []);

  const fetchProdutores = async () => {
    try {
      const response = await axios.get('https://api-motoristas.coopergraos.com.br/produtores.php');
      setProdutores(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtores:', error);
    }
  };

  const handleOpenModal = (type, produtor = null) => {
    setModalType(type);
    setCurrentProdutor(
      produtor || {
        nome_produtor: ''
      }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleProdutorChange = (e) => {
    const { name, value } = e.target;
    setCurrentProdutor({ ...currentProdutor, [name]: value });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSalvarProdutor = async () => {
    try {
      if (modalType === 'editar') {
        await axios.put('https://api-motoristas.coopergraos.com.br/produtores.php', currentProdutor);
      } else {
        await axios.post('https://api-motoristas.coopergraos.com.br/produtores.php', currentProdutor);
      }
      fetchProdutores();
      handleCloseModal();
      showSnackbar("Produtor salvo com sucesso!", "success");
    } catch (error) {
      console.error('Erro ao salvar produtor:', error);
      showSnackbar("Erro ao salvar produtor", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('https://api-motoristas.coopergraos.com.br/produtores.php', { data: { id } });
      fetchProdutores();
      showSnackbar("Produtor excluído com sucesso!", "success");
    } catch (error) {
      console.error('Erro ao excluir produtor:', error);
      showSnackbar("Erro ao excluir produtor", "error");
    }
  };

  // Configuração das colunas para Material React Table
  const columns = [
    { accessorKey: 'nome_produtor', header: 'Nome do Produtor' },
    {
      accessorKey: 'acoes',
      header: 'Ações',
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <>
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
            Adicionar Produtor
          </Button>

          {/* Tabela com filtros e paginação */}
          <MaterialReactTable
            columns={columns}
            data={produtores}
            enableColumnFilters
            enablePagination
            initialState={{ pagination: { pageSize: 25 } }}
          />

          {/* Modal de Cadastro/Edição */}
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box sx={{ position: 'relative', width: '80%', maxWidth: 600, margin: 'auto', mt: 10, p: 3, backgroundColor: 'white', borderRadius: 2 }}>
              {/* Botão "X" para fechar */}
              <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 8, right: 8, color: 'black' }}>
                <Close />
              </IconButton>

              <Typography variant="h6">
                {modalType === 'adicionar' ? 'Adicionar Produtor' : 'Editar Produtor'}
              </Typography>
              <TextField label="Nome do Produtor" name="nome_produtor" value={currentProdutor?.nome_produtor} onChange={handleProdutorChange} fullWidth margin="normal" />
              <Button variant="contained" onClick={handleSalvarProdutor} sx={{ mt: 2 }}>Salvar</Button>
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

export default CadastroProdutor;
