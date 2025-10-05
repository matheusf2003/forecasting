import React from 'react';
import './Header.css'; // Vamos importar o estilo que criaremos a seguir
import nasaLogo from '../../assets/logo.svg'; // Importa a imagem do logo

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-logo">
        <img src={nasaLogo} alt="NASA Logo" />
      </div>
      <div className="header-text">
        <h1>Will It Rain On My Parade?</h1>
        <p>Análise de Probabilidade Climática com Dados da NASA</p>
      </div>
    </header>
  );
};

export default Header;