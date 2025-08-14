import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, TextField, Box, Modal, Typography, 
  IconButton, Snackbar, Alert, MenuItem, Container
} from '@mui/material';
import { Edit, Delete, AddCircle, Close } from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table';



const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [modalType, setModalType] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://api-motoristas.coopergraos.com.br/usuarios.php');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleOpenModal = (type, usuario = null) => {
    setModalType(type);
    setCurrentUsuario(
      usuario || {
        nome: '',
        email: '',
        senha: '',
        niveis_acesso_id: 1,
      }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setCurrentUsuario({ ...currentUsuario, [name]: value });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

const handleSalvarUsuario = async () => {
  try {
    await axios.post('https://api-motoristas.coopergraos.com.br/usuarios.php', currentUsuario);
    fetchUsuarios();
    handleCloseModal();
    showSnackbar("Usuário salvo com sucesso!", "success");
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    showSnackbar("Erro ao salvar usuário", "error");
  }
};



  const handleDelete = async (id) => {
    try {
      await axios.delete('https://api-motoristas.coopergraos.com.br/usuarios.php', { data: { id } });
      fetchUsuarios();
      showSnackbar("Usuário excluído com sucesso!", "success");
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      showSnackbar("Erro ao excluir usuário", "error");
    }
  };

  const getNivelAcessoNome = (nivelAcessoId) => {
    switch (parseInt(nivelAcessoId, 10)) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Usuário';
      default:
        return 'Desconhecido';
    }
  };

  // Configuração das colunas para Material React Table
  const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'niveis_acesso_id',
      header: 'Nível de Acesso',
      Cell: ({ row }) => getNivelAcessoNome(row.original.niveis_acesso_id),
    },
    {
      accessorKey: 'acoes',
      header: 'Ações',
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <>
          <IconButton onClick={() => handleOpenModal('edit', row.original)}><Edit /></IconButton>
          <IconButton onClick={() => handleDelete(row.original.id)}><Delete /></IconButton>
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
            startIcon={<AddCircle />}
            onClick={() => handleOpenModal('add')}
            sx={{ mb: 2 }}
          >
            Adicionar Usuário
          </Button>

          {/* Tabela com filtros e paginação */}
          <MaterialReactTable
            columns={columns}
            data={usuarios}
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
                {modalType === 'add' ? 'Adicionar Usuário' : 'Editar Usuário'}
              </Typography>
              
              <TextField label="Nome" name="nome" value={currentUsuario?.nome} onChange={handleUsuarioChange} fullWidth margin="normal" />
              <TextField label="Email" name="email" value={currentUsuario?.email} onChange={handleUsuarioChange} fullWidth margin="normal" />
              <TextField label="Senha" name="senha" type="password" value={currentUsuario?.senha} onChange={handleUsuarioChange} fullWidth margin="normal" />
              
              <TextField
                label="Nível de Acesso"
                name="niveis_acesso_id"
                value={currentUsuario?.niveis_acesso_id}
                onChange={handleUsuarioChange}
                select
                fullWidth
                margin="normal"
              >
                <MenuItem value={1}>Administrador</MenuItem>
                <MenuItem value={2}>Usuário</MenuItem>
              </TextField>

              <Button variant="contained" onClick={handleSalvarUsuario} sx={{ mt: 2 }}>Salvar</Button>
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

export default Usuarios;
