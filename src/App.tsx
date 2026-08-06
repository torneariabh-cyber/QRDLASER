import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Páginas (vamos criar agora)
const ClientPage = () => {
  return (
    <div className="page-container">
      <div className="header">
        <div className="logo">⚡ D Laser Premium</div>
        <nav>
          <Link to="/client" className="nav-link active">Cliente</Link>
          <Link to="/operator" className="nav-link">Operador</Link>
          <Link to="/engraving/teste" className="nav-link">Gravação</Link>
        </nav>
      </div>
      
      <div className="content">
        <div className="card">
          <h1>🎨 Personalize seu Ticket</h1>
          <p className="subtitle">Digite seu nome e escolha sua fonte preferida</p>
          
          <div className="form-group">
            <label>✏️ Seu Nome</label>
            <input type="text" placeholder="Digite seu nome aqui..." className="input-field" />
          </div>
          
          <div className="form-group">
            <label>🔤 Escolha a Fonte</label>
            <div className="font-selector">
              <button className="font-btn">Arial ▼</button>
            </div>
          </div>
          
          <div className="form-group">
            <label>🎯 Escolha um Ícone</label>
            <div className="icon-grid">
              <button className="icon-btn">⭐</button>
              <button className="icon-btn">❤️</button>
              <button className="icon-btn">🔥</button>
              <button className="icon-btn">🌟</button>
              <button className="icon-btn">🎨</button>
              <button className="icon-btn">💎</button>
            </div>
          </div>
          
          <div className="preview-box">
            <p>👀 Prévia</p>
            <div className="preview-text">Seu Nome</div>
          </div>
          
          <button className="btn-primary">🚀 Enviar para Gravação</button>
        </div>
      </div>
    </div>
  );
};

const OperatorPage = () => {
  return (
    <div className="page-container">
      <div className="header">
        <div className="logo">⚡ D Laser Premium</div>
        <nav>
          <Link to="/client" className="nav-link">Cliente</Link>
          <Link to="/operator" className="nav-link active">Operador</Link>
          <Link to="/engraving/teste" className="nav-link">Gravação</Link>
        </nav>
      </div>
      
      <div className="content">
        <div className="card">
          <h1>🔧 Painel do Operador</h1>
          <p className="subtitle">Gerencie os tickets de personalização</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>📊 Total</h3>
              <p className="stat-number">0</p>
            </div>
            <div className="stat-card">
              <h3>⏳ Pendentes</h3>
              <p className="stat-number">0</p>
            </div>
            <div className="stat-card">
              <h3>✅ Processados</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
          
          <div className="scan-section">
            <h3>📷 Escanear QR Code</h3>
            <div className="scan-input">
              <input type="text" placeholder="Digite o ID do ticket" className="input-field" />
              <button className="btn-secondary">Processar</button>
            </div>
            <div className="scanner-placeholder">
              📷 Câmera: Clique para ativar
            </div>
          </div>
          
          <div className="tickets-list">
            <h3>Tickets Recentes</h3>
            <div className="ticket-empty">
              Nenhum ticket disponível
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EngravingPage = () => {
  return (
    <div className="page-container">
      <div className="header">
        <div className="logo">⚡ D Laser Premium</div>
        <nav>
          <Link to="/client" className="nav-link">Cliente</Link>
          <Link to="/operator" className="nav-link">Operador</Link>
          <Link to="/engraving/teste" className="nav-link active">Gravação</Link>
        </nav>
      </div>
      
      <div className="content">
        <div className="card">
          <h1>🎨 Gravação On-site</h1>
          <p className="subtitle">Personalize seu item com estilo e precisão</p>
          
          <div className="event-info">
            <p><strong>Evento:</strong> Teste</p>
          </div>
          
          <div className="form-group">
            <label>✏️ Nome</label>
            <input type="text" placeholder="Digite seu nome" className="input-field" />
          </div>
          
          <div className="form-group">
            <label>💬 Mensagem</label>
            <input type="text" placeholder="Digite sua mensagem" className="input-field" />
          </div>
          
          <div className="form-group">
            <label>🎨 Opções Gráficas</label>
            <div className="svg-options">
              <button className="svg-btn selected">Design 1</button>
              <button className="svg-btn">Design 2</button>
              <button className="svg-btn">Design 3</button>
            </div>
          </div>
          
          <button className="btn-primary">📤 Enviar para Gravação</button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/client" replace />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/operator" element={<OperatorPage />} />
        <Route path="/engraving/:eventName" element={<EngravingPage />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
