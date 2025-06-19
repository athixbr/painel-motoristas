import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaFilter, FaSearch } from "react-icons/fa";
import "./Status.css";

const StatusExterno = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filters, setFilters] = useState({
    data: "", placas: "", motorista: "", status: "", hora_chegada: "",
    transportadora: "", empresa: "", nfe: "", produto: ""
  });
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [productCounts, setProductCounts] = useState({});


  const MAX_VISIBLE_ITEMS = 30;

  useEffect(() => {
    fetchResults();
    const fetchInterval = setInterval(fetchResults, 7000);
    return () => clearInterval(fetchInterval);
  }, []);

  const fetchResults = async () => {
    try {
      setError(null);
      const response = await axios.get("https://api-motoristas.coopergraos.com.br/status_externo.php");

      if (Array.isArray(response.data) && response.data.length > 0) {
        const newResults = response.data.slice(0, MAX_VISIBLE_ITEMS);
        setResults(newResults);
        setFilteredResults(newResults);
        calculateProductCounts(newResults);
      } else {
        setResults([]);
        setProductCounts({});
        console.error("A resposta da API está vazia ou não é um array:", response.data);
      }
    } catch (error) {
      setError("Erro ao buscar os dados. Tente novamente mais tarde.");
      console.error("Erro ao buscar os dados:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

const applyFilters = useCallback(() => {
  const filtered = results.filter((item) => {
    // 👉 Filtro de data com busca parcial (ex: "14", "06/2025", etc)
    if (filters.data) {
      const formatDateBR = (isoDate) => {
        if (!isoDate) return "";
        const [year, month, day] = isoDate.split("-");
        return `${day}/${month}/${year}`;
      };

      const itemDataBR = formatDateBR(item.data);
      if (!itemDataBR.includes(filters.data)) return false;
    }

    // 👉 Demais filtros
    return (
      item.placas.toLowerCase().includes(filters.placas.toLowerCase()) &&
      item.motorista.toLowerCase().includes(filters.motorista.toLowerCase()) &&
      item.status.toLowerCase().includes(filters.status.toLowerCase()) &&
      item.hora_chegada.includes(filters.hora_chegada) &&
      item.transportadora.toLowerCase().includes(filters.transportadora.toLowerCase()) &&
      item.empresa.toLowerCase().includes(filters.empresa.toLowerCase()) &&
      item.nfe.toLowerCase().includes(filters.nfe.toLowerCase()) &&
      item.produto.toLowerCase().includes(filters.produto.toLowerCase())
    );
  }).slice(0, MAX_VISIBLE_ITEMS);

  setFilteredResults(filtered);
}, [filters, results]);



  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const calculateProductCounts = (data) => {
    const counts = {};
    data.forEach((item) => {
      if (
        item.status === "Aguarde Liberação p/ carregamento" ||
        item.status === "Liberado para Carregamento"
      ) {
        if (!counts[item.produto]) {
          counts[item.produto] = 0;
        }
        counts[item.produto] += 1;
      }
    });
    setProductCounts(counts);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Liberado para Carregamento":
        return "status-liberado-carregamento";
      case "Aguarde Liberação p/ carregamento":
        return "status-aguarde-liberacao";
      default:
        return "status-padrao";
    }
  };
const formatDateBR = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};


  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <div id="logo">
            <img src="https://athix.com.br/img/bg_cooperfibra.png" id="icon" alt="User Icon" />
          </div>
          <br />
          <div className="nav">
            STATUS EXTERNO - FIQUE ATENTO AS INFORMAÇÕES DO SEU CARREGAMENTO
          </div>
        </div>
      </header>

      <div className="container-fluid">
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="product-counters">
              <h2>Contagem por Produto</h2>
              <ul>
                {Object.keys(productCounts).map((produto, index) => (
                  <li key={index}>
                    <strong>{produto}:</strong> {productCounts[produto]}
                  </li>
                ))}
              </ul>
            </div>

            <table>
              <thead>
                <tr>
                  <th>DATA <FaFilter onClick={() => setShowFilters(!showFilters)} /></th>

                  <th>PLACA <FaFilter onClick={() => setShowFilters(!showFilters)} /></th>
                  <th>MOTORISTA <FaFilter onClick={() => setShowFilters(!showFilters)} /></th>
                  <th>TRANSPORTADORA <FaFilter onClick={() => setShowFilters(!showFilters)} /></th>
                  <th>EMPRESA <FaFilter onClick={() => setShowFilters(!showFilters)} /></th>
                  <th>PRODUTO <FaFilter onClick={() => setShowFilters(!showFilters)} /></th>
                  <th>STATUS <FaFilter onClick={() => setShowFilters(!showFilters)} /></th>
                </tr>
                {showFilters && (
                  <tr className="filter-row">
<td>
  <input
    type="text"
    name="data"
    value={filters.data}
    onChange={handleFilterChange}
    placeholder="dd/mm/aaaa"
  />
</td>

                    <td><input type="text" name="placas" value={filters.placas} onChange={handleFilterChange} placeholder="Filtrar por Placa" /></td>
                    <td><input type="text" name="motorista" value={filters.motorista} onChange={handleFilterChange} placeholder="Filtrar por Motorista" /></td>
                    <td><input type="text" name="transportadora" value={filters.transportadora} onChange={handleFilterChange} placeholder="Filtrar por Transportadora" /></td>
                    <td><input type="text" name="empresa" value={filters.empresa} onChange={handleFilterChange} placeholder="Filtrar por Empresa" /></td>
                    <td><input type="text" name="produto" value={filters.produto} onChange={handleFilterChange} placeholder="Filtrar por Produto" /></td>
                    <td><input type="text" name="status" value={filters.status} onChange={handleFilterChange} placeholder="Filtrar por Status" /></td>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((item, index) => (
                    <tr key={index} className={getStatusClass(item.status)}>
                      <td>{formatDateBR(item.data)}</td>


                      <td>{item.placas}</td>
                      <td>{item.motorista}</td>
                      <td>{item.transportadora}</td>
                      <td>{item.empresa}</td>
                      <td>{item.produto}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Nenhum dado disponível.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      <button className="floating-search" onClick={() => setShowFilters(!showFilters)}>
        <FaSearch />
      </button>

      <footer className="footer">
        <a href="https://www.athix.com.br" target="_blank" rel="noopener noreferrer">
          ATHIX
        </a>
      </footer>
    </div>
  );
};

export default StatusExterno;
