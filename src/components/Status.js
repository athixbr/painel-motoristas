import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, Typography, Paper, Table, TableBody, 
  TableCell, TableHead, TableRow, Button, Alert, Box 
} from "@mui/material";
import { Info as InfoIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import "./Status.css"; // Estilos do CSS

const Status = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(12);

  useEffect(() => {
    fetchResults();
    const fetchInterval = setInterval(fetchResults, 5000);
    return () => clearInterval(fetchInterval);
  }, []);

  const fetchResults = async () => {
    try {
      setError(null);
      const response = await axios.get("https://api-motoristas.coopergraos.com.br/get_status.php");

      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        setResults([]);
        console.error("A resposta da API não é um array:", response.data);
      }
    } catch (error) {
      setError("Erro ao buscar os dados. Tente novamente mais tarde.");
      console.error("Erro ao buscar os dados:", error);
    }
  };

  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 12);
  };

  return (
    <Container maxWidth="md" sx={{ padding: 5, textAlign: "center" }}>
      {/* Logo */}
      <div className="sidebar-logo">
        <img 
          src="https://athix.com.br/img/bg_cooperfibra.png" 
          alt="Logo" 
          className="sidebar-logo-image" 
        />
      </div>

      {/* Aviso sobre novos links */}
      <Alert 
        icon={<InfoIcon />} 
        severity="warning" 
        sx={{ mb: 3, backgroundColor: "#FBC02D", color: "#000", fontWeight: "bold" }}
      >
        Agora você pode acessar os status também nos links:
        <strong> <a href="https://interno.coopergraos.com.br" target="_blank" rel="noopener noreferrer">interno.coopergraos.com.br</a> </strong> e
        <strong> <a href="https://externo.coopergraos.com.br" target="_blank" rel="noopener noreferrer">externo.coopergraos.com.br</a> </strong>.
      </Alert>

      {/* Botões de acesso rápido */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#1B5E20", color: "#FFF", "&:hover": { backgroundColor: "#145A14" } }} 
          href="https://interno.coopergraos.com.br" 
          target="_blank"
        >
          Acessar Interno
        </Button>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#1B5E20", color: "#FFF", "&:hover": { backgroundColor: "#145A14" } }} 
          href="https://externo.coopergraos.com.br" 
          target="_blank"
        >
          Acessar Externo
        </Button>
      </Box>

      {/* Mensagem de erro, se houver */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

  

    
      {/* Botão de atualização */}
   
    </Container>
  );
};

export default Status;
