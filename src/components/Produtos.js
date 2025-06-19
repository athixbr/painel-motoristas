
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoAtual, setProdutoAtual] = useState({ id: null, nome: '' });
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Buscar produtos da API
  useEffect(() => {
    fetch('https://api-motoristas.coopergraos.com.br/produtos.php')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  // Abrir modal para adicionar produto
  const abrirModalAdicionar = () => {
    setProdutoAtual({ id: null, nome: '' });
    setModoEdicao(false);
    setModalAberto(true);
  };

  // Abrir modal para editar produto
  const abrirModalEditar = (produto) => {
    setProdutoAtual(produto);
    setModoEdicao(true);
    setModalAberto(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setModalAberto(false);
    setProdutoAtual({ id: null, nome: '' });
  };

  // Salvar produto (adicionar ou editar)
  const salvarProduto = () => {
    const metodo = 'POST';
    fetch('https://api-motoristas.coopergraos.com.br/produtos.php', {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtoAtual)
    })
      .then(response => response.json())
      .then(() => {
        // Atualizar lista de produtos após salvar
        return fetch('https://api-motoristas.coopergraos.com.br/produtos.php')
          .then(response => response.json())
          .then(data => setProdutos(data));
      })
      .catch(error => console.error('Erro ao salvar produto:', error))
      .finally(() => fecharModal());
  };

  // Excluir produto
  const excluirProduto = (id) => {
    fetch('https://api-motoristas.coopergraos.com.br/produtos.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(() => {
        // Atualizar lista de produtos após exclusão
        setProdutos(produtos.filter(produto => produto.id !== id));
      })
      .catch(error => console.error('Erro ao excluir produto:', error));
  };

  // Controle de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ px: 2 }}>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={abrirModalAdicionar}
        sx={{ mb: 2 }}
      >
        Adicionar Produto
      </Button>

      {/* Tabela de produtos */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="Produtos">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.id}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => abrirModalEditar(produto)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => excluirProduto(produto.id)}>
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
          count={produtos.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 50]}
        />
      </Paper>

      {/* Modal para adicionar/editar produto */}
      <Dialog open={modalAberto} onClose={fecharModal}>
        <DialogTitle>
          {modoEdicao ? 'Editar Produto' : 'Adicionar Produto'}
          <IconButton
            aria-label="fechar"
            onClick={fecharModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Produto"
            type="text"
            fullWidth
            value={produtoAtual.nome}
            onChange={(e) => setProdutoAtual({ ...produtoAtual, nome: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
          <Button onClick={salvarProduto} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
}
export default Produtos;
