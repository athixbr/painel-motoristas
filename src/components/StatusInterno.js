import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaSearch } from "react-icons/fa"; // Ícones de filtro e pesquisa
import "./Status.css";

const StatusInterno = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filters, setFilters] = useState({
    data: "",
    placas: "",
    motorista: "",
    status: "",
    hora_chegada: "",
    produto: "" // Novo campo para filtro
  });
  const [error, setError] = useState(null);
  const [visibleItems, setVisibleItems] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchResults();
    const fetchInterval = setInterval(fetchResults, 5000);
    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, results]);

  const fetchResults = async () => {
    try {
      setError(null);
      const response = await axios.get("https://api-motoristas.coopergraos.com.br/status_interno.php");

      if (Array.isArray(response.data) && response.data.length > 0) {
        setResults(response.data);
        setFilteredResults(response.data); // Inicializar com todos os dados
      } else {
        setResults([]);
        console.error("A resposta da API está vazia ou não é um array:", response.data);
      }
    } catch (error) {
      setError("Erro ao buscar os dados. Tente novamente mais tarde.");
      console.error("Erro ao buscar os dados:", error);
    }
  };

  const loadMoreItems = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 12);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

const applyFilters = () => {
  const filtered = results
    .filter(
      (item) =>
        item.status !== "Aguarde Liberação p/ carregamento" &&
        item.status !== "Liberado para Carregamento"
    )
    .filter((item) => {
      if (filters.data) {
        const itemDataBR = formatDateBR(item.data);
        if (!itemDataBR.includes(filters.data)) return false;
      }

      return (
        item.placas.toLowerCase().includes(filters.placas.toLowerCase()) &&
        item.motorista.toLowerCase().includes(filters.motorista.toLowerCase()) &&
        item.status.toLowerCase().includes(filters.status.toLowerCase()) &&
        item.hora_chegada.includes(filters.hora_chegada) &&
        item.produto.toLowerCase().includes(filters.produto.toLowerCase())
      );
    });

  setFilteredResults(filtered);
};


  const getStatusClass = (status) => {
    switch (status) {
      case "Liberado para Carregamento":
        return "status-liberado";
      case "Aguarde Liberação p/ carregamento":
        return "status-aguardando";
      case "Liberado - Buscar NF-E":
        return "status-buscar-nfe";
      case "Processo em andamento":
        return "status-andamento";
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
            <img
              src="https://athix.com.br/img/bg_cooperfibra.png"
              id="icon"
              alt="User Icon"
            />
          </div>
          <br />
          <div className="nav">
            STATUS INTERNO - FIQUE ATENTO AS INFORMAÇÕES DO SEU CARREGAMENTO VERIFICANDO A TELA REGULARMENTE
          </div>
        </div>
      </header>

      <div className="container-fluid">
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                    <th>DATA <FaFilter onClick={() => setShowFilters(!showFilters)} /></th> {/* ✅ */}

                  <th>PLACA <FaFilter onClick={() => setShowFilters(!showFilters)} /></th>
                  <th>MOTORISTA <FaFilter onClick={() => setShowFilters(!showFilters)} /></th>
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
    placeholder="Filtrar por Data (dd/mm/aaaa)"
  />
</td>

                    <td>
                      <input
                        type="text"
                        name="placas"
                        value={filters.placas}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por Placa"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="motorista"
                        value={filters.motorista}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por Motorista"
                      />
                    </td>
                    <td>
  <input
    type="text"
    name="produto"
    value={filters.produto}
    onChange={handleFilterChange}
    placeholder="Filtrar por Produto"
  />
</td>

                    <td>
                      <input
                        type="text"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por Status"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="hora_chegada"
                        value={filters.hora_chegada}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por Hora de Chegada"
                      />
                    </td>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredResults.length > 0 ? (
                  filteredResults
                    .slice(0, visibleItems)
                    .map((item, index) => (
                      <tr key={index} className={getStatusClass(item.status)}>
                        <td>{formatDateBR(item.data)}</td>

                        <td>{item.placas}</td>
                        <td>{item.motorista}</td>
                        <td>{item.produto}</td>

                        <td>
                          {item.status}{" "}
                          {item.tempo_limite && `(${item.tempo_limite})`}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4">Nenhum dado disponível.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {visibleItems < filteredResults.length && (
              <button className="load-more" onClick={loadMoreItems}>
                Veja Mais
              </button>
            )}
          </>
        )}
      </div>

      {/* Botão flutuante de pesquisa */}
      <button className="floating-search" onClick={() => setShowFilters(!showFilters)}>
        <FaSearch />
      </button>

      <footer className="footer">
        <a
          href="https://www.athix.com.br"
          target="_blank"
          rel="noopener noreferrer"
        >
          ATHIX
        </a>
      </footer>
    </div>
  );
};

export default StatusInterno;
