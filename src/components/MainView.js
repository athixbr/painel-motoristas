import React from 'react';
import Table from './Table';
import './MainView.css';

function MainView() {
  return (
    <div className="main-container">
      <header>
        <img src="/logo.png" alt="Coopergrãos Logo" className="logo" />
        <h1>Fique atento às informações do seu carregamento</h1>
      </header>
      <Table />
      <button className="load-more">Carregar Mais</button>
    </div>
  );
}

export default MainView;
