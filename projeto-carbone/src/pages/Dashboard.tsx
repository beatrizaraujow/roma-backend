import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Carrinho } from '../components/Carrinho';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <Carrinho />
      
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header-new">
          {/* Logo */}
          <div className="dashboard-logo-new">
            <img 
              src="/Sublogo.png" 
              alt="ROMA" 
              className="dashboard-logo-image"
            />
          </div>

          {/* Navigation */}
          <nav className="dashboard-nav">
            <a href="#" className="nav-link">Como Funciona</a>
            <a href="#" className="nav-link">Recursos</a>
            <a href="#" className="nav-link">Suporte</a>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="dashboard-content-area">
          <div className="dashboard-welcome-section">
            <h1>Bem-vindo ao ROMA</h1>
            <p>Sua plataforma de aprendizagem</p>
          </div>
        </div>
      </div>
    </div>
  );
};
