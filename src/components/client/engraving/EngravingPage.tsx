import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEngraving } from '../../hooks/useEngraving';
import { useSocket } from '../../hooks/useSocket';
import { useTickets } from '../../hooks/useTickets';
import ProductCanvas from './ProductCanvas';
import SvgSelector from './SvgSelector';
import TextFields from './TextFields';
import TicketDisplay from './TicketDisplay';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import './styles/EngravingPage.css';

interface EngravingConfig {
  eventName: string;
  eventLogo?: string;
  displayImage?: {
    enabled: boolean;
    url: string;
    size?: number;
  };
  fields: Array<{
    id: string;
    title: string;
    charLimit: number;
  }>;
  quantityLimit: number;
  scannerMode: 'hid' | 'advanced';
  brandColors?: {
    primary: string;
    secondary: string;
  };
  productCustomization?: {
    enabled: boolean;
    svgOverlays?: Array<{
      id: string;
      name: string;
      urls: string[];
      defaultIndex: number;
    }>;
    textFieldConfigs?: Array<{
      fieldId: string;
      fontSize?: number;
      fontFamily?: string;
      position?: { x: number; y: number };
    }>;
  };
  globalSettings?: {
    darkMode: {
      enabled: boolean;
      auto: boolean;
    };
  };
}

const EngravingPage: React.FC = () => {
  const { eventName } = useParams<{ eventName: string }>();
  const navigate = useNavigate();
  const socket = useSocket();
  const { createTicket } = useTickets();
  const [config, setConfig] = useState<EngravingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState<any[]>([]);
  const [ticketCode, setTicketCode] = useState<string | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [customizationMode, setCustomizationMode] = useState<'text' | 'graphics' | 'both' | 'exclusive'>('both');
  const [activeCustomization, setActiveCustomization] = useState<'text' | 'graphics' | null>(null);
  const [pendingSubmission, setPendingSubmission] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const formRef = useRef<HTMLFormElement>(null);
  const { initializeEngraving, submitEngraving } = useEngraving();

  // Carregar configuração do evento
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        // Tentar carregar do cache ou buscar do servidor
        const cachedConfig = sessionStorage.getItem(`engraving_config_${eventName}`);
        if (cachedConfig) {
          setConfig(JSON.parse(cachedConfig));
          setLoading(false);
          return;
        }

        const response = await fetch(`/config/${eventName}`);
        if (!response.ok) throw new Error('Failed to load configuration');
        const data = await response.json();
        setConfig(data);
        sessionStorage.setItem(`engraving_config_${eventName}`, JSON.stringify(data));
      } catch (error) {
        console.error('Error loading config:', error);
        toast.error('Erro ao carregar configuração. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (eventName) {
      loadConfig();
    }
  }, [eventName]);

  // Configurar modo de customização
  useEffect(() => {
    if (!config) return;

    const hasTextFields = config.fields?.length > 0;
    const hasMultipleSvgOptions = config.productCustomization?.svgOverlays?.some(
      overlay => overlay.urls.length > 1 && overlay.urls.some(url => url?.trim())
    );

    if (hasTextFields && hasMultipleSvgOptions) {
      setCustomizationMode('exclusive');
      // Iniciar com texto como padrão
      setActiveCustomization('text');
    } else if (hasTextFields) {
      setCustomizationMode('text');
      setActiveCustomization('text');
    } else if (hasMultipleSvgOptions) {
      setCustomizationMode('graphics');
      setActiveCustomization('graphics');
    } else {
      setCustomizationMode('both');
      setActiveCustomization(null);
    }
  }, [config]);

  // Aplicar cores da marca
  useEffect(() => {
    if (config?.brandColors) {
      const root = document.documentElement;
      const { primary, secondary } = config.brandColors;
      
      if (primary) {
        root.style.setProperty('--brand-primary', primary);
        root.style.setProperty('--brand-primary-hover', adjustColorBrightness(primary, -10));
      }
      if (secondary) {
        root.style.setProperty('--brand-secondary', secondary);
        root.style.setProperty('--brand-secondary-hover', adjustColorBrightness(secondary, -10));
      }
    }
  }, [config]);

  // Monitorar status da internet
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const adjustColorBrightness = (color: string, percent: number): string => {
    const hex = color.replace('#', '');
    const adjust = (c: number) => Math.max(0, Math.min(255, c + (c * percent / 100)));
    const rgb = [0, 2, 4].map(i => Math.round(adjust(parseInt(hex.substr(i, 2), 16))));
    return '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');
  };

  const handleTextChange = (fieldId: string, value: string) => {
    // Atualizar dados de submissão
    setSubmissionData(prev => {
      const existing = prev.findIndex(f => f.fieldId === fieldId);
      if (existing >= 0) {
        const newData = [...prev];
        newData[existing] = { ...newData[existing], value };
        return newData;
      }
      return [...prev, { fieldId, value, isText: true }];
    });

    // Ativar modo texto
    if (value.trim() && customizationMode === 'exclusive') {
      setActiveCustomization('text');
    }
  };

  const handleSvgSelect = (overlayId: string, selectedIndex: number) => {
    // Ativar modo gráfico
    if (customizationMode === 'exclusive') {
      setActiveCustomization('graphics');
    }
  };

  const handleSubmit = async () => {
    if (!config) return;

    // Verificar limite
    if (SubmissionTracker.isLimitExceeded(config.quantityLimit)) {
      toast.error('Limite de submissões atingido para este evento.');
      return;
    }

    // Coletar dados
    const textFields = submissionData
      .filter(f => f.isText && f.value)
      .map(f => ({ title: f.fieldId, value: f.value }));

    const svgFields = submissionData
      .filter(f => !f.isText && f.value)
      .map(f => ({ title: f.fieldId, value: f.value }));

    // Verificar se há dados
    if (textFields.length === 0 && svgFields.length === 0) {
      toast.error('Preencha pelo menos um campo ou selecione um gráfico.');
      return;
    }

    // Verificar emojis
    const hasEmoji = textFields.some(f => containsEmoji(f.value));
    if (hasEmoji) {
      toast.error('Emojis não são permitidos. Por favor, remova-os.');
      return;
    }

    // Gerar código do ticket
    const code = Math.random().toString(36).substr(2, 9).toUpperCase();
    setTicketCode(code);

    const submission = [...textFields, ...svgFields];

    if (isOffline) {
      // Modo offline
      SubmissionTracker.addSubmission(code, submission);
      setPendingSubmission({ uniqueCode: code, submission });
      setShowTicket(true);
      toast.success('Ticket gerado localmente (offline)');
    } else {
      // Enviar para o servidor
      try {
        const response = await fetch(`/${eventName}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uniqueCode: code, submission })
        });

        if (!response.ok) throw new Error('Submission failed');

        SubmissionTracker.addSubmission(code, submission);
        setShowTicket(true);
        toast.success('Ticket enviado com sucesso!');
      } catch (error) {
        console.error('Submission error:', error);
        // Fallback para offline
        SubmissionTracker.addSubmission(code, submission);
        setPendingSubmission({ uniqueCode: code, submission });
        setShowTicket(true);
        toast.warning('Ticket salvo localmente. Será enviado quando online.');
      }
    }

    // Criar ticket no sistema D Laser
    try {
      await createTicket({
        name: textFields[0]?.value || 'Cliente',
        font: 'Arial',
        icon: ''
      });
    } catch (error) {
      console.warn('Failed to create D Laser ticket:', error);
    }
  };

  if (loading) {
    return (
      <div className="engraving-loading">
        <LoadingSpinner size="large" />
        <p>Carregando configuração do evento...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="engraving-error">
        <h2>Evento não encontrado</h2>
        <p>Não foi possível carregar a configuração para "{eventName}"</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Voltar ao início
        </button>
      </div>
    );
  }

  if (showTicket && ticketCode) {
    return (
      <TicketDisplay
        ticketCode={ticketCode}
        submissionData={submissionData}
        eventName={config.eventName}
        scannerMode={config.scannerMode}
        isOffline={isOffline}
        onBack={() => {
          setShowTicket(false);
          setTicketCode(null);
        }}
        onStatusChange={(status) => {
          console.log('Ticket status:', status);
        }}
      />
    );
  }

  return (
    <div className="engraving-page">
      <header className="engraving-header">
        {config.eventLogo && (
          <img
            src={config.eventLogo}
            alt={`${config.eventName} logo`}
            className="event-logo"
            fetchPriority="high"
          />
        )}
        <h1 className="event-name">{config.eventName}</h1>
      </header>

      <main className="engraving-main">
        {/* Display Image */}
        {config.displayImage?.enabled && config.displayImage.url && (
          <div className="display-image-container slide-up animation-delay-1">
            <img
              src={config.displayImage.url}
              alt="Display"
              style={{ maxWidth: `${config.displayImage.size || 60}%` }}
            />
          </div>
        )}

        {/* Product Canvas */}
        {config.productCustomization?.enabled && (
          <div className="product-canvas-container slide-up animation-delay-1">
            <ProductCanvas
              config={config.productCustomization}
              displayImageUrl={config.displayImage?.url}
              onSvgSelect={handleSvgSelect}
            />
          </div>
        )}

        {/* SVG Selector */}
        {config.productCustomization?.svgOverlays && (
          <SvgSelector
            svgOverlays={config.productCustomization.svgOverlays}
            onSelect={handleSvgSelect}
            mode={customizationMode}
            activeMode={activeCustomization}
            onActivate={() => setActiveCustomization('graphics')}
          />
        )}

        {/* Form */}
        <form ref={formRef} className="engraving-form slide-up animation-delay-2">
          {customizationMode === 'exclusive' && (
            <button
              type="button"
              className="text-toggle-btn"
              onClick={() => {
                setActiveCustomization(prev => prev === 'text' ? null : 'text');
              }}
            >
              {activeCustomization === 'text' ? '▼' : '▶'} Opções de Texto
            </button>
          )}

          <div className={`fields-container ${customizationMode === 'exclusive' && activeCustomization !== 'text' ? 'collapsed' : ''}`}>
            <TextFields
              fields={config.fields}
              onTextChange={handleTextChange}
              onActivate={() => {
                if (customizationMode === 'exclusive') {
                  setActiveCustomization('text');
                }
              }}
            />
          </div>

          <div className="buttons-container slide-up animation-delay-3">
            <button
              type="button"
              className="btn-history"
              onClick={async () => {
                // Carregar modal de histórico
                try {
                  const { LookupModal } = await import('../../services/engraving');
                  const modal = new LookupModal({
                    eventName: config.eventName,
                    submissionTracker: SubmissionTracker,
                    scannerMode: config.scannerMode,
                  });
                  modal.show();
                } catch (error) {
                  console.error('Failed to load lookup modal:', error);
                  toast.error('Não foi possível abrir o histórico.');
                }
              }}
            >
              Histórico
            </button>
            <button
              type="button"
              className="btn-submit"
              onClick={handleSubmit}
              disabled={isOffline && pendingSubmission !== null}
            >
              {isOffline && pendingSubmission ? '⏳ Pendente' : 'Enviar'}
            </button>
          </div>
        </form>

        {/* Status offline */}
        {isOffline && (
          <div className="offline-banner">
            <span className="offline-dot"></span>
            Modo Offline - Os tickets serão salvos localmente
          </div>
        )}
      </main>

      <footer className="engraving-footer">
        <p>&copy; {new Date().getFullYear()} {config.eventName}</p>
      </footer>
    </div>
  );
};

// Submission Tracker para localStorage
const SubmissionTracker = {
  getSubmissions() {
    const key = `event_submissions_${eventName}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  addSubmission(ticketCode: string, submissionData: any) {
    const submissions = this.getSubmissions();
    submissions.push({
      ticketCode,
      submissionData,
      timestamp: Date.now()
    });
    const key = `event_submissions_${eventName}`;
    localStorage.setItem(key, JSON.stringify(submissions));
  },

  getCount() {
    return this.getSubmissions().length;
  },

  isLimitExceeded(limit: number) {
    return this.getCount() >= limit;
  }
};

// Função de validação de emojis
function containsEmoji(text: string): boolean {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2}|[0-9#*]\uFE0F?\u20E3|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji}[\u200D\uFE0F])/gu;
  return emojiRegex.test(text);
}

export default EngravingPage;
