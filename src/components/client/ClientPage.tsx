import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSocket } from '../../hooks/useSocket';
import { useTickets } from '../../hooks/useTickets';
import { FONTS } from '../../utils/fonts';
import { ICONS } from '../../utils/icons';
import './styles/ClientPage.css';

const ClientPage: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontSearch, setFontSearch] = useState('');
  
  const socket = useSocket();
  const { createTicket } = useTickets();
  const navigate = useNavigate();

  // Filtra fontes
  const filteredFonts = FONTS.filter(font =>
    font.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
    font.category.toLowerCase().includes(fontSearch.toLowerCase())
  );

  // Atualiza status via socket
  useEffect(() => {
    if (!socket) return;

    const handleTicketUpdate = (updatedTicket: any) => {
      if (ticket && updatedTicket.id === ticket.id) {
        setTicket(updatedTicket);
        if (updatedTicket.status === 'processed') {
          toast.success('✅ Seu ticket foi processado com sucesso!');
        } else if (updatedTicket.status === 'error') {
          toast.error('❌ Erro ao processar seu ticket.');
        }
      }
    };

    socket.on('ticket-updated', handleTicketUpdate);
    socket.on('ticket-processed', handleTicketUpdate);
    socket.on('ticket-error', handleTicketUpdate);

    return () => {
      socket.off('ticket-updated', handleTicketUpdate);
      socket.off('ticket-processed', handleTicketUpdate);
      socket.off('ticket-error', handleTicketUpdate);
    };
  }, [socket, ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Por favor, digite seu nome.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📤 Enviando ticket:', { name, font: selectedFont, icon: selectedIcon });
      
      const response = await createTicket({
        name: name.trim(),
        font: selectedFont,
        icon: selectedIcon,
      });

      console.log('📥 Resposta:', response);

      if (response.success) {
        setTicket(response.ticket);
        setShowResult(true);
        toast.success('🎉 Ticket criado com sucesso!');
        
        if (socket) {
          socket.emit('register-client', response.ticketId);
        }
      } else {
        toast.error('Erro ao criar ticket: ' + (response.error || 'Tente novamente'));
      }
    } catch (error: any) {
      console.error('❌ Erro:', error);
      toast.error(error.message || 'Erro ao criar ticket. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewDesign = () => {
    setShowResult(false);
    setTicket(null);
    setName('');
    setSelectedFont('Arial');
    setSelectedIcon('');
  };

  // Preview ao vivo
  const previewText = selectedIcon ? `${selectedIcon} ${name || 'Seu Nome'}` : (name || 'Seu Nome');

  if (showResult && ticket) {
    return (
      <div className="client-page">
        <div className="container">
          <div className="client-card animate-fade-in">
            <div className="result-card">
              <div className="result-icon">✅</div>
              <h2>Ticket Criado!</h2>
              <p>Seu design foi enviado para o operador</p>
              
              <div className="qr-code-container">
                <div className="qr-code-wrapper">
                  {ticket.qrCode ? (
                    <img src={ticket.qrCode} alt="QR Code" style={{ maxWidth: '160px' }} />
                  ) : (
                    <div style={{ 
                      width: '160px', 
                      height: '160px', 
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999'
                    }}>
                      QR Code
                    </div>
                  )}
                </div>
                <div className="ticket-info">
                  <p className="ticket-id-label">ID do Ticket</p>
                  <p className="ticket-id-value">{ticket.id?.slice(0, 8) || '---'}</p>
                </div>
              </div>

              <div className="status-container">
                <div className="status-indicator">
                  <span className="status-dot pending"></span>
                  Aguardando processamento...
                </div>
              </div>

              <button className="btn-secondary" onClick={handleNewDesign} style={{ marginTop: '16px' }}>
                ✨ Novo Design
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-page">
      <div className="container">
        <div className="client-card animate-fade-in">
          <div className="client-header">
            <div className="logo-container">
              <div className="logo-icon">⚡</div>
              <div className="logo-text">
                <span className="logo-d">D</span>
                <span className="logo-laser">LASER</span>
                <span className="logo-premium">PREMIUM</span>
              </div>
            </div>
            <h1>🎨 Crie seu Design</h1>
            <p className="subtitle">Personalize seu item com estilo e precisão</p>
          </div>

          <form onSubmit={handleSubmit} className="client-form">
            {/* Campo Nome */}
            <div className="form-group">
              <label>
                <span className="label-icon">✏️</span>
                Seu Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome aqui..."
                maxLength={30}
                required
                autoFocus
              />
              <div className="input-hint">Máximo 30 caracteres</div>
            </div>

            {/* Selector de Fonte */}
            <div className="form-group">
              <label>
                <span className="label-icon">🔤</span>
                Escolha a Fonte
              </label>
              <div className="font-selector-wrapper">
                <button
                  type="button"
                  className={`font-toggle-btn ${isFontDropdownOpen ? 'active' : ''}`}
                  onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                >
                  <span 
                    className="selected-font-display"
                    style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                  >
                    {selectedFont}
                  </span>
                  <span className="toggle-arrow">▼</span>
                </button>

                {isFontDropdownOpen && (
                  <div className="font-dropdown animate-slide-down">
                    <div className="font-search">
                      <input
                        type="text"
                        placeholder="🔍 Buscar fonte..."
                        value={fontSearch}
                        onChange={(e) => setFontSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="font-grid">
                      {filteredFonts.length === 0 ? (
                        <div className="font-empty">Nenhuma fonte encontrada</div>
                      ) : (
                        filteredFonts.map((font) => (
                          <button
                            key={font.name}
                            type="button"
                            className={`font-option ${selectedFont === font.name ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedFont(font.name);
                              setIsFontDropdownOpen(false);
                              setFontSearch('');
                            }}
                          >
                            <span 
                              className="font-sample"
                              style={{ fontFamily: `'${font.name}', sans-serif` }}
                            >
                              {font.sample}
                            </span>
                            <span className="font-category">{font.category}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ícones */}
            <div className="form-group">
              <label>
                <span className="label-icon">🎯</span>
                Escolha um Ícone
              </label>
              <div className="icon-grid">
                <button
                  type="button"
                  className={`icon-option ${selectedIcon === '' ? 'selected' : ''}`}
                  onClick={() => setSelectedIcon('')}
                >
                  <span className="icon-symbol">✖</span>
                  <span className="icon-label">Nenhum</span>
                </button>
                
                {ICONS.map((icon) => (
                  <button
                    key={icon.symbol}
                    type="button"
                    className={`icon-option ${selectedIcon === icon.symbol ? 'selected' : ''}`}
                    onClick={() => setSelectedIcon(icon.symbol)}
                  >
                    <span className="icon-symbol">{icon.symbol}</span>
                    <span className="icon-label">{icon.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="live-preview">
              <h4>👀 Prévia</h4>
              <div className="preview-box">
                <span
                  id="previewText"
                  style={{ fontFamily: `'${selectedFont}', sans-serif` }}
                >
                  {previewText}
                </span>
              </div>
            </div>

            {/* Botão Enviar */}
            <button
              type="submit"
              className="btn-premium"
              disabled={isSubmitting}
            >
              <span className="btn-content">
                <span className="btn-icon">
                  {isSubmitting ? '⏳' : '🚀'}
                </span>
                <span className="btn-text">
                  {isSubmitting ? 'Enviando...' : 'Enviar para Gravação'}
                </span>
              </span>
              <span className="btn-pulse"></span>
            </button>
          </form>

          <div className="client-footer">
            <button
              className="btn-operator"
              onClick={() => navigate('/operator')}
            >
              🔧 Painel do Operador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
