import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, TextField, Select, MenuItem, Box, Modal, Typography,
  Pagination, InputAdornment, IconButton, TableFooter, Autocomplete 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Edit, Delete, Visibility, Close } from '@mui/icons-material';
import { Snackbar, Alert } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';



const ControleEmbarque = () => {
  const [embarques, setEmbarques] = useState([]);
  const [filteredEmbarques, setFilteredEmbarques] = useState([]);
  const [motoristas, setMotoristas] = useState([]); // Estado para armazenar os motoristas da API
  const [currentEmbarque, setCurrentEmbarque] = useState({});
const [produtos, setProdutos] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('visualizar'); // 'visualizar' | 'editar' | 'adicionar'
  const [nivelAcesso, setNivelAcesso] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'
const [isSaving, setIsSaving] = useState(false);
const [snackbar, setSnackbar] = useState({
  open: false,
  message: '',
  severity: 'success', // 'success' | 'error' | 'info' | 'warning'
});

const [columnSizing, setColumnSizing] = useState(() => {
  const saved = localStorage.getItem('columnSizing_embarque');
  return saved ? JSON.parse(saved) : {};
});

const handleCloseSnackbar = () => {
  setSnackbar((prev) => ({ ...prev, open: false }));
};


  useEffect(() => {
    fetchEmbarques();
    fetchMotoristas(); 
      fetchProdutos(); 

    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  setNivelAcesso(userProfile ? userProfile.nivelAcesso : null);

  // Carrega os embarques ao montar o componente
  fetchEmbarques();
  }, []);
  

  useEffect(() => {
    const filtered = embarques
      .filter((emb) => emb.data !== '0000-00-00') // Filtrar datas inválidas
      .filter((emb) =>
        Object.keys(emb).some((key) =>
          emb[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  
    setFilteredEmbarques(filtered);
  }, [searchTerm, embarques]);

  
  useEffect(() => {
    // Filtrar os dados com base no termo de busca
    const filtered = embarques.filter((emb) =>
      Object.keys(emb).some((key) =>
        emb[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  
    // Atualiza o estado dos embarques filtrados
    setFilteredEmbarques(filtered);
  
    // Sempre retorna para a página inicial ao pesquisar
  }, [searchTerm, embarques]); // Executa ao alterar o termo de busca ou os dados
  
  
  

  

  useEffect(() => {
    console.log("Embarques filtrados:", filteredEmbarques);
  }, [filteredEmbarques]);
  
  
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const fetchEmbarques = async () => {
    try {
      const response = await axios.get('https://api-motoristas.coopergraos.com.br/controle_embarque.php');
      console.log("Resposta completa da API:", response);
  
      if (Array.isArray(response.data)) {
        // Filtra registros com data válida (diferente de 0000-00-00)
        const validEmbarques = response.data.filter(emb => emb.data !== '0000-00-00');
  
        // Função para ordenação dos embarques
        const sortEmbarques = (a, b) => {
          const dateA = new Date(a.data);
          const dateB = new Date(b.data);
  
          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;
  
          const timeA = a.hora_chegada || "00:00:00";
          const timeB = b.hora_chegada || "00:00:00";
  
          if (timeA > timeB) return -1;
          if (timeA < timeB) return 1;
  
          return b.id - a.id; // Desempate pelo ID
        };
  
        const sortedEmbarques = validEmbarques.sort(sortEmbarques);
  
        // Atualiza o estado com os embarques válidos e ordenados
        setEmbarques(sortedEmbarques);
        setFilteredEmbarques(sortedEmbarques);
      } else {
        console.error("Os dados retornados não são um array:", response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar embarques:", error.response?.data || error.message);
    }
  };
  
  
  
  
  
  const fetchMotoristas = async () => {
    // Fazer requisição para obter motoristas
    const response = await axios.get('https://api-motoristas.coopergraos.com.br/motoristas.php');
    setMotoristas(response.data);
  };

  const fetchProdutos = async () => {
  try {
    const response = await axios.get('https://api-motoristas.coopergraos.com.br/produtos.php');
    setProdutos(response.data);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
};

// Função de pesquisa aprimorada para aceitar qualquer valor (letras, números, datas)
const handleSearch = () => {
  const value = searchTerm.trim().toLowerCase();

  if (value === '') {
    return embarques; // Retorna todos os embarques
  }

  return embarques.filter((emb) =>
    Object.keys(emb).some((key) => {
      let field = emb[key];
      if (!field) return false;

      // Formatar campos de data
      if (['data', 'hora_chegada', 'hora_entrada', 'hora_saida'].includes(key)) {
        field = new Date(field).toLocaleDateString('pt-BR');
      }

      return field.toString().toLowerCase().includes(value);
    })
  );
};







const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
};



  
  
  
  

const handleOpenModal = (type, embarque = null) => {
  setModalType(type);

  setCurrentEmbarque(
    embarque || {
      data: new Date().toISOString().slice(0, 10),
      transportadora: '',
      motorista: '',
      placas: '',
      hora_chegada: getLocalTimeInCuiaba(),
      hora_entrada: '',
      hora_saida: '',
      nfe: '',
      empresa: '',
      status: 'Aguarde Liberação p/ carregamento',
      produto: '',
      id: embarque?.id || null, // Garante que o ID seja tratado
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

  // Função para selecionar o motorista e atualizar a placa
  const handleMotoristaChange = (event, newValue) => {
    setCurrentEmbarque((prevEmbarque) => ({
      ...prevEmbarque,
      motorista: newValue ? newValue.nome.toUpperCase() : '', // Nome do motorista em maiúsculas
      placas: newValue ? newValue.placa.toUpperCase() : ''    // Placa em maiúsculas
    }));
  };
  
  
  
  

  const handleEmbarqueChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmbarque((prevEmbarque) => ({
      ...prevEmbarque,
      [name]: name === 'placas'
        ? value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
        : value,
    }));
  };
  
  const handleSalvarEmbarque = async () => {
    if (!currentEmbarque?.produto) {
      setSnackbarMessage('Por favor, selecione o produto antes de salvar.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const embarqueData = {
        ...currentEmbarque,
        id: currentEmbarque.id || null, // Certifica-se de que o ID é passado
        status: currentEmbarque.status || 'Aguarde Liberação p/ carregamento',
      };
  
      let response;
  
      if (modalType === 'editar') {
        if (!embarqueData.id) {
          setSnackbarMessage('Erro: ID do embarque não encontrado para edição.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          return;
        }
  
        console.log("Editando embarque:", embarqueData);
  
        response = await axios.put(
          'https://api-motoristas.coopergraos.com.br/controle_embarque.php',
          embarqueData
        );
  
        if (response.data?.success) {
          const updatedEmbarques = embarques.map((emb) =>
            Number(emb.id) === Number(embarqueData.id) ? { ...emb, ...embarqueData } : emb
          );
          
          setEmbarques(updatedEmbarques);
          setFilteredEmbarques(updatedEmbarques);
  
          // Verifica se o status foi alterado
          const oldEmbarque = embarques.find((emb) => emb.id === embarqueData.id);
          if (oldEmbarque?.status !== embarqueData.status) {
            console.log(`Status alterado: ${oldEmbarque?.status} -> ${embarqueData.status}`);
            await enviarNotificacao(embarqueData);
          }
  
          setSnackbarMessage('Embarque atualizado com sucesso!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          throw new Error('Erro ao atualizar o embarque.');
        }
      } else if (modalType === 'adicionar') {
        console.log("Adicionando novo embarque:", embarqueData);
  
        response = await axios.post(
          'https://api-motoristas.coopergraos.com.br/controle_embarque.php',
          embarqueData
        );
  
        if (response.data?.success) {
          await fetchEmbarques();
  
          if (embarqueData.status === 'Aguarde Liberação p/ carregamento') {
            console.log("Enviando notificação para status padrão...");
            await enviarNotificacao(embarqueData);
          }
  
          setSnackbarMessage('Novo embarque adicionado com sucesso!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          throw new Error('Erro ao adicionar o embarque.');
        }
      }
  
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar o embarque:", error.response?.data || error.message);
      setSnackbarMessage('Erro ao salvar o embarque. Por favor, tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  
  
  
  

const handleSaveAndPrint = async () => {
  if (isSaving) return;

  console.log("🟢 Botão SALVAR clicado!");
  setIsSaving(true);

  try {
    await handleSalvarEmbarque();

    console.log("✅ Embarque salvo com sucesso!");

    setSnackbar({
      open: true,
      message: 'Registro salvo com sucesso!',
      severity: 'success',
    });

    if (currentEmbarque.status === 'Liberado - Buscar NF-e') {
      console.log("📄 Status exige impressão: exibindo modal...");
      setModalType('imprimir');
      setOpenModal(true);
    }
  } catch (error) {
    console.error("❌ Erro ao salvar e imprimir:", error);
    setSnackbar({
      open: true,
      message: 'Erro ao salvar o registro!',
      severity: 'error',
    });
  } finally {
    setIsSaving(false);
  }
};
  
  const handlePrintModal = () => {
    const modalContent = document.getElementById('printable-modal');

    // Cria um iframe invisível para impressão
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';

    // Adiciona o iframe ao documento
    document.body.appendChild(printFrame);

    // Insere o conteúdo do modal no iframe
    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Impressão de Liberação</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              font-size: 21px;
              line-height: 1.5;
              margin: 0;
              padding: 15px;
            }
            .signature-line {
              margin-top: 80px; /* Espaço maior para assinatura */
            }
            .no-print {
              display: none !important; /* Oculta elementos desnecessários */
            }
          </style>
        </head>
        <body>
          <!-- Inclui a logo -->
        
          <!-- Insere o conteúdo do modal -->
          ${modalContent.innerHTML}
        </body>
      </html>
    `);
    doc.close();

    // Aguarda o carregamento completo antes de imprimir
    printFrame.onload = () => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();

        // Remove o iframe após a impressão
        document.body.removeChild(printFrame);
    };
};

  

  const enviarNotificacao = async (embarque) => {
    try {
      console.log("Enviando notificação para motorista:", embarque);
  
      await axios.post('https://api-motoristas.coopergraos.com.br/notificacao.php', {
        motorista: embarque.motorista,
        status: embarque.status,
      });
  
      setSnackbarMessage(`Notificação enviada para o motorista: ${embarque.motorista}`);
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao enviar notificação:", error.response?.data || error.message);
      setSnackbarMessage('Erro ao enviar notificação. Verifique o console para mais detalhes.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  
 




  const formatDate = (dateString) => {
    if (!dateString) return ''; 
  
    const [year, month, day] = dateString.split('-'); 
    return `${day}/${month}/${year}`; 
  };
    
const handleSalvarPDF = async () => {
  const html2pdf = (await import('html2pdf.js')).default;

  const modalContent = document.getElementById('printable-modal');

  const opt = {
    margin: 0.3,
    filename: `liberacao_embarque_${currentEmbarque.motorista || 'motorista'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(modalContent).set(opt).save();
};




  
  const handleDelete = async (id) => {
    try {
      // Confirmação de exclusão para evitar exclusões acidentais
  
      // Chamada para o backend com o método DELETE
      await axios.delete('https://api-motoristas.coopergraos.com.br/controle_embarque.php', {
        data: { id }, // Passa o ID no corpo da requisição
      });

      // Feedback visual
    setSnackbar({
      open: true,
      message: 'Registro excluído com sucesso!',
      severity: 'success',
    });
  
      // Atualiza os dados localmente após a exclusão bem-sucedida
      const updatedEmbarques = embarques.filter((emb) => emb.id !== id);
      setEmbarques(updatedEmbarques);
      setFilteredEmbarques(updatedEmbarques);
  
      // Exibe um snackbar de sucesso
      setSnackbarMessage('Registro excluído com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao excluir o registro:', error.response?.data || error.message);
  
      // Exibe um snackbar de erro
      setSnackbarMessage('Erro ao excluir o registro. Verifique o console para mais detalhes.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  


  const [columnVisibility, setColumnVisibility] = useState(() => {
  const saved = localStorage.getItem('columnVisibility_embarque');
  return saved ? JSON.parse(saved) : {
    empresa: false,
    nfe: false,
    hora_chegada: false,
    hora_entrada: false,
    hora_saida: false,
    status: false,
  };
});
useEffect(() => {
  localStorage.setItem('columnVisibility_embarque', JSON.stringify(columnVisibility));
}, [columnVisibility]);


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
    { accessorKey: 'transportadora', header: 'Transportadora' },
    { accessorKey: 'motorista', header: 'Motorista' },
    { accessorKey: 'placas', header: 'Placas' },
    { accessorKey: 'produto', header: 'Produto' },
    { accessorKey: 'empresa', header: 'Empresa'}, 
    { accessorKey: 'nfe', header: 'NF-e'}, // Ocultável
    { accessorKey: 'hora_chegada', header: 'Hora de Chegada' }, // Ocultável
    { accessorKey: 'hora_entrada', header: 'Hora de Entrada' }, // Ocultável
    { accessorKey: 'hora_saida', header: 'Hora de Saída' }, // Ocultável
    { accessorKey: 'status', header: 'Status' }, // Ocultável
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
        <Box sx={{ flexGrow: 1, p: 4 }}>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal('adicionar')}
            sx={{ mb: 2 }}
          >
            Adicionar Embarque
          </Button>



<Modal open={openModal} onClose={handleCloseModal}>
<Box
    id="printable-modal" // Adiciona um ID ao modal
    sx={{
      width: '80%',
      maxWidth: 800,
      margin: 'auto',
      mt: 10,
      p: 3,
      backgroundColor: 'white',
      borderRadius: 2,
      overflowY: 'auto',
      maxHeight: '80vh',
      textAlign: 'center',
    }}
  >
    {modalType === 'imprimir' ? (
      <>
        <Typography variant="h5" sx={{ fontSize: '16px', mb: 4 }}>Liberação para Saída</Typography>
        <img 
          src="http://www.athix.com.br/img/bg_cooperfibra.png" 
          alt="Logo" 
          style={{ width: '100px', marginBottom: '15px' }} 
        />

        <Typography sx={{ fontSize: '15px', marginBottom: '2px' }}>
          <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}
        </Typography>
        <Typography sx={{ fontSize: '15px', marginBottom: '2px' }}>
          <strong>Motorista:</strong> {currentEmbarque.motorista || ''}
        </Typography>
        <Typography sx={{ fontSize: '15px', marginBottom: '2px' }}>
          <strong>Placa:</strong> {currentEmbarque.placas}
        </Typography>
        <Typography sx={{ fontSize: '15px', marginBottom: '2px' }}>
          <strong>Produto:</strong> {currentEmbarque.produto}
        </Typography>
        <Typography sx={{ fontSize: '15px', marginBottom: '2px' }}>
          <strong>NF-e:</strong> {currentEmbarque.nfe}
        </Typography>
        <Typography sx={{ fontSize: '15px', marginBottom: '2px' }}>
          <strong>Status:</strong> {currentEmbarque.status}
        </Typography>

        <Typography sx={{ fontSize: '19px', mt: 3 }}>
  Sr. Motorista, por favor entregar essa liberação ao guarda apenas com o caminhão alinhado para saída.
</Typography>

<Typography
  sx={{ fontSize: '19px', mt: 5 }} // Define o espaço entre o texto acima e a linha
  className="signature-line"
>
  ____________________________
</Typography>

<Typography
  sx={{ fontSize: '19px', mt: 2 }} // Define o espaço entre a linha e o texto abaixo
  className="below-line-text"
>
  Carimbo e Assinatura do Liberador
</Typography>


      <Button
  variant="contained"
  color="primary"
  onClick={handleSalvarPDF}
  sx={{ mt: 2, mr: 2 }}
  className="no-print"
>
  Salvar PDF
</Button>



        <Button
          variant="contained"
          onClick={handlePrintModal} // Alterado para chamar handlePrintModal
          sx={{ mt: 2 }}
          className="no-print" // Marcação para esconder durante impressão

        >
          Imprimir
        </Button>

        <Button
          variant="outlined"
          onClick={handleCloseModal}
          sx={{ mt: 2, ml: 2 }}
          className="no-print" // Marcação para esconder durante impressão

        >
          Fechar
        </Button>
      </>
    ) : (
      // Conteúdo para adicionar/editar o embarque
      <>
        {/* Coloque aqui o conteúdo de adicionar/editar */}
      



            <Typography variant="h6">
              {modalType === 'adicionar' ? 'Adicionar Embarque' : 'Editar Embarque'}
            </Typography>

            <TextField
              label="Transportadora"
              name="transportadora"
              value={currentEmbarque?.transportadora || ''}
              onChange={(e) =>
                handleEmbarqueChange({
                  target: { name: 'transportadora', value: e.target.value.toUpperCase() },
                })
              }
              fullWidth
              margin="normal"
            />

<Autocomplete
  options={motoristas}
  getOptionLabel={(option) => option.nome ? option.nome.toUpperCase() : ''} // Exibe o nome em maiúsculas
  onChange={handleMotoristaChange}
  renderInput={(params) => (
    <TextField {...params} label="Motorista" fullWidth margin="normal" />
  )}
  value={
    motoristas.find((motorista) => motorista.nome.toUpperCase() === currentEmbarque.motorista) || null
  }
/>

<TextField
  label="Placas"
  name="placas"
  value={currentEmbarque.placas || ''} // Exibe a placa preenchida automaticamente
  fullWidth
  margin="normal"
  InputProps={{
    readOnly: true, // Define o campo como somente leitura
  }}
/>

        <Select
  label="Produto"
  name="produto"
  value={currentEmbarque?.produto || ''}
  onChange={handleEmbarqueChange}
  fullWidth
  margin="normal"
  required
  error={!currentEmbarque.produto}
  helperText={!currentEmbarque.produto ? 'Produto é obrigatório' : ''}
>
  {produtos.map((produto) => (
    <MenuItem key={produto.id} value={produto.nome}>
      {produto.nome}
    </MenuItem>
  ))}
</Select>



            <TextField
              label="Empresa"
              name="empresa"
              value={currentEmbarque?.empresa || ''}
              onChange={(e) =>
                handleEmbarqueChange({
                  target: { name: 'empresa', value: e.target.value.toUpperCase() },
                })
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="NF-e"
              name="nfe"
              value={currentEmbarque?.nfe || ''}
              onChange={handleEmbarqueChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Hora de Chegada"
              type="time"
              name="hora_chegada"
              value={currentEmbarque?.hora_chegada || ''}
              onChange={handleEmbarqueChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Hora de Entrada"
              type="time"
              name="hora_entrada"
              value={currentEmbarque?.hora_entrada || ''}
              onChange={handleEmbarqueChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Hora de Saída"
              type="time"
              name="hora_saida"
              value={currentEmbarque?.hora_saida || ''}
              onChange={handleEmbarqueChange}
              fullWidth
              margin="normal"
            />

<Select
  label="Status"
  name="status"
  value={currentEmbarque?.status || ''}
  onChange={(e) => handleEmbarqueChange(e)} // Mantém a função de mudança no estado
  fullWidth
  margin="normal"
>
  <MenuItem value="Aguarde Liberação p/ carregamento">Aguarde Liberação p/ carregamento</MenuItem>
  <MenuItem value="Liberado para Carregamento">Liberado para Carregamento</MenuItem>
  <MenuItem value="Processo em andamento">Processo em andamento</MenuItem>
  <MenuItem value="Liberado - Buscar NF-e">Liberado - Buscar NF-e</MenuItem>
</Select>


            <Button
              variant="contained"
              onClick={handleSaveAndPrint}
              sx={{ mt: 2 }}
            >
              Salvar
            </Button>

            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{ mt: 2, ml: 2 }}
            >
              Fechar
            </Button>
          </>
        )}
      </Box>
    </Modal>

    <MaterialReactTable
  columns={columns}
  data={filteredEmbarques}
  enableColumnFilters
  enablePagination
  enableStickyHeader
  enableHiding
  enableColumnResizing
  enableDensityToggle
  enableFullScreenToggle={true}
  state={{ columnVisibility }}
  onColumnVisibilityChange={setColumnVisibility}
  onColumnSizingChange={setColumnSizing}
  muiTableContainerProps={{
    sx: {
      maxHeight: 'auto',   // Mantém a rolagem vertical dentro da tabela
      overflowX: 'visible', // Permite que a tabela ultrapasse a largura da tela
      width: 'auto',       // Garante que a tabela ocupe toda a largura visível
    }
  }}
  
  muiTableProps={{
    sx: {
      minWidth: 'auto',  // Garante que a tabela seja maior que a tela
      whiteSpace: 'nowrap', // Impede quebra de texto nas células
      tableLayout: 'fixed', // Mantém as colunas com tamanho fixo
    }
  }}
  
  
  initialState={{
    pagination: { pageSize: 25 },
    columnVisibility: {
      empresa: false,
      nfe: false,
      hora_chegada: false,
      hora_entrada: false,
      hora_saida: false,
      status: false,
    },
  }}
/>









        </Box>
      </Box>
<Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert
    onClose={handleCloseSnackbar}
    severity={snackbar.severity}
    sx={{ width: '100%' }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>




      
    </>
  );
};

export default ControleEmbarque;
