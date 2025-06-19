import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, TextField, Select, MenuItem, Box, Modal, Typography,
  Pagination, InputAdornment, IconButton, TableFooter, Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { Close } from '@mui/icons-material';

import { MaterialReactTable } from 'material-react-table';


const ControleEntradaProduto = () => {
  const [entradas, setEntradas] = useState([]);
  const [filteredEntradas, setFilteredEntradas] = useState([]);
  const [produtores, setProdutores] = useState([]); // Estado para armazenar os produtores
  const [motoristas, setMotoristas] = useState([]); // Estado para armazenar os motoristas
const [produtos, setProdutos] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentEntrada, setCurrentEntrada] = useState(null);
  const [modalType, setModalType] = useState('visualizar');

  const [nivelAcesso, setNivelAcesso] = useState(null);


  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    setNivelAcesso(userProfile ? userProfile.nivelAcesso : null);
  
    // Carrega as entradas de produto ao montar o componente
    fetchEntradas();
    fetchProdutores();
      fetchProdutos(); 

    fetchMotoristas(); // Certifique-se de chamar fetchMotoristas aqui
  }, []);

  const fetchEntradas = async () => {
    const response = await axios.get('https://api-motoristas.coopergraos.com.br/controle_entrada_produto.php');
    setEntradas(response.data);
    setFilteredEntradas(response.data);
  };

  const fetchProdutores = async () => {
    try {
      const response = await axios.get('https://api-motoristas.coopergraos.com.br/produtores.php');
      setProdutores(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtores:", error);
    }
  };

  const fetchProdutos = async () => {
  try {
    const response = await axios.get('https://api-motoristas.coopergraos.com.br/produtos.php');
    setProdutos(response.data);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
};

  const fetchMotoristas = async () => {
    try {
      const response = await axios.get('https://api-motoristas.coopergraos.com.br/motoristas.php');
      setMotoristas(response.data);
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error);
    }
  };

 // Função para buscar nas colunas específicas de forma sincronizada e precisa
 const handleSearchChange = (e) => {
  const value = e.target.value.toUpperCase(); // Removeu o trim() para permitir espaços
  setSearchTerm(value);

  if (value === '') {
    // Se o termo de busca estiver vazio, mostrar todas as entradas
    setFilteredEntradas(entradas);
  } else {
    const filtered = entradas.filter((entry) => {
      // Formata a data para o formato exibido na tabela
      const formattedDate = entry.data
        ? new Date(entry.data).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        : '';

      return [
        formattedDate,  // Formata e inclui a data para busca
        entry.produtor,
        entry.motorista,
        entry.placas,
        entry.produto,
        entry.hora_chegada,
        entry.hora_entrada,
        entry.hora_saida,
        entry.observacao
      ].some((field) => field && field.toString().toUpperCase().includes(value));
    });
    setFilteredEntradas(filtered);
  }
};
const [error, setError] = useState(false);



  

  const handleOpenModal = (type, entrada = null) => {
    setModalType(type);
    setCurrentEntrada(
      entrada || {
        data: new Date().toISOString().slice(0, 10), // Dia atual em formato ISO
        produtor: '',
        motorista: '',
        placas: '',
        hora_chegada: getLocalTimeInCuiaba(),
        hora_entrada: '',
        hora_saida: '',
        produto: '',
        observacao: ''
      }
    );
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const getLocalTimeInCuiaba = () => {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Cuiaba' };
    const [hour, minute] = now.toLocaleTimeString('pt-BR', options).split(':');
    return `${hour}:${minute}`;
  };

  const handleMotoristaChange = (event, newValue) => {
    setCurrentEntrada({ ...currentEntrada, motorista: newValue?.nome || '' });
  };

  const handleEntradaChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntrada({ ...currentEntrada, [name]: value });
  };

  const handleProdutorChange = (event, newValue) => {
    setCurrentEntrada({ ...currentEntrada, produtor: newValue?.nome_produtor || '' });
  };

  const handleSalvarEntrada = async () => {
    if (!currentEntrada?.produto) {
      alert("Por favor, selecione um produto.");
      return; // Impede o salvamento se o produto não for selecionado
    }
  
    if (modalType === 'editar') {
      await axios.put('https://api-motoristas.coopergraos.com.br/controle_entrada_produto.php', currentEntrada);
    } else {
      await axios.post('https://api-motoristas.coopergraos.com.br/controle_entrada_produto.php', currentEntrada);
    }
    fetchEntradas();
    handleCloseModal();
  };
  

  const handleDelete = async (id) => {
    await axios.delete('https://api-motoristas.coopergraos.com.br/controle_entrada_produto.php', { data: { id } });
    fetchEntradas();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00'); // Garante o timezone correto
    return date.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  };
  

  const paginatedEntradas = [...filteredEntradas].reverse(); // Sem divisão por página



  // Função para garantir apenas letras e números em maiúsculas
  const handlePlacasChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCurrentEntrada({ ...currentEntrada, placas: value });
  };

  const columns = [
    {
  accessorKey: 'data',
  header: 'Data',
  Cell: ({ cell }) => formatDate(cell.getValue()),
  filterFn: (row, id, filterValue) => {
    const formatted = formatDate(row.getValue(id));
    return formatted.includes(filterValue);
  }
},
    { accessorKey: 'produtor', header: 'Produtor' },
    { accessorKey: 'motorista', header: 'Motorista' },
    { accessorKey: 'placas', header: 'Placas' },
    { accessorKey: 'produto', header: 'Produto' },
    { accessorKey: 'hora_chegada', header: 'Hora de Chegada' },
    { accessorKey: 'hora_entrada', header: 'Hora de Entrada' },
    { accessorKey: 'hora_saida', header: 'Hora de Saída' },
    { accessorKey: 'observacao', header: 'Observação' },
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
            Adicionar Entrada
          </Button>

         

          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              sx={{
                width: '80%',
                maxWidth: 800,
                margin: 'auto',
                mt: 10,
                p: 3,
                backgroundColor: 'white',
                borderRadius: 2,
                overflowY: 'auto',
                maxHeight: '80vh'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
  <IconButton onClick={handleCloseModal}>
    <Close />
  </IconButton>
</Box>

              <Typography variant="h6">
                {modalType === 'adicionar' ? 'Adicionar Entrada' : 'Editar Entrada'}
              </Typography>

              {/* Autocomplete para Produtor */}
              <Autocomplete
                options={produtores}
                getOptionLabel={(option) => option.nome_produtor || ''}
                onChange={handleProdutorChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Produtor"
                    fullWidth
                    margin="normal"
                  />
                )}
                value={
                  produtores.length > 0
                    ? produtores.find((produtor) => produtor.nome_produtor === currentEntrada?.produtor) || null
                    : null
                }
              />

<Autocomplete
  options={motoristas}
  getOptionLabel={(option) => option.nome.toUpperCase()} // Exibe o nome do motorista em maiúsculas na lista
  onChange={(event, newValue) => {
    setCurrentEntrada({
      ...currentEntrada,
      motorista: newValue ? newValue.nome.toUpperCase() : '', // Define o nome do motorista ou limpa se for null
      placas: newValue ? newValue.placa : '' // Define a placa ou limpa se o motorista for desmarcado
    });
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Motorista"
      fullWidth
      margin="normal"
    />
  )}
  value={motoristas.find((motorista) => motorista.nome.toUpperCase() === currentEntrada?.motorista) || null}
/>

<TextField
  label="Placas"
  name="placas"
  value={currentEntrada?.placas}
  onChange={(e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCurrentEntrada({ ...currentEntrada, placas: value });
  }}
  fullWidth
  margin="normal"
  InputProps={{
    readOnly: true, // Torna o campo apenas leitura
  }}
/>



<Select
  label="Produto"
  name="produto"
  value={currentEntrada?.produto || ''}
  onChange={handleEntradaChange}
  fullWidth
  margin="normal"
  required
  error={!currentEntrada?.produto}
  helperText={!currentEntrada?.produto ? 'Produto é obrigatório' : ''}
>
  {produtos.map((produto) => (
    <MenuItem key={produto.id} value={produto.nome}>
      {produto.nome}
    </MenuItem>
  ))}
</Select>






              <TextField
                label="Hora de Chegada"
                type="time"
                name="hora_chegada"
                value={currentEntrada?.hora_chegada}
                onChange={handleEntradaChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Hora de Entrada"
                type="time"
                name="hora_entrada"
                value={currentEntrada?.hora_entrada}
                onChange={handleEntradaChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Hora de Saída"
                type="time"
                name="hora_saida"
                value={currentEntrada?.hora_saida}
                onChange={handleEntradaChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Observação"
                name="observacao"
                value={currentEntrada?.observacao}
                onChange={handleEntradaChange}
                fullWidth
                margin="normal"
              />

              <Button
                variant="contained"
                onClick={handleSalvarEntrada}
                sx={{ mt: 2 }}
              >
                Salvar
              </Button>
            </Box>
          </Modal>

         <MaterialReactTable
  columns={columns}
  data={filteredEntradas}
  enableColumnFilters
  enablePagination
  enableStickyHeader
  enableHiding
  enableColumnResizing
  enableDensityToggle
  enableFullScreenToggle={true}
  stateStorageKey="controle_entrada_colunas" // 🧠 persistência no localStorage
  muiTableContainerProps={{
    sx: {
      maxHeight: 'auto',
      overflowX: 'auto',
      width: 'auto',
    }
  }}
  muiTableProps={{
    sx: {
      minWidth: 'auto',
      whiteSpace: 'nowrap',
      tableLayout: 'fixed',
    }
  }}
  initialState={{
    pagination: { pageSize: 100 },
    columnVisibility: {
      observacao: false,
    },
  }}
/>



       
       
        </Box>
      </Box>
    </>
  );
};

export default ControleEntradaProduto;
