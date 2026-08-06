import React, { useEffect, useRef, useState } from 'react';
import './styles/EngravingPage.css';

interface TicketDisplayProps {
  ticketCode: string;
  submissionData: any[];
  eventName: string;
  scannerMode: 'hid' | 'advanced';
  isOffline: boolean;
  onBack: () => void;
  onStatusChange?: (status: string) => void;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({
  ticketCode,
  submissionData,
  eventName,
  scannerMode,
  isOffline,
  onBack,
  onStatusChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'pending' | 'completed' | 'local' | 'error'>(
    isOffline ? 'local' : 'loading'
  );
  const [ticketInfo, setTicketInfo] = useState<{
    code: string;
    data: any[];
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    const renderTicket = async () => {
      if (!containerRef.current) return;

      try {
        // Carregar biblioteca de barcode
        const barcodeLib = scannerMode === 'advanced' 
          ? '/lib/js/aztec-bundle.min.js' 
          : '/lib/js/qrcode.min.js';
        
        await loadScript(barcodeLib);
        await loadScript('/js/ticketComponent.js');

        if (typeof window.TicketComponent === 'function') {
          const ticketComponent = new window.TicketComponent(containerRef.current, {
            autoRender: false,
            onBack: () => {
              onBack();
            },
            onStatusChange: (newStatus: string) => {
              setStatus(newStatus as any);
              if (onStatusChange) onStatusChange(newStatus);
            }
          });

          ticketComponent.setTicketData(
            ticketCode,
            submissionData,
            eventName,
            isOffline,
            scannerMode
          );
          ticketComponent.render();
          ticketComponent.show();

          if (!isOffline) {
            // Verificar status no servidor
            try {
              const response = await fetch(`/ticket/${ticketCode}`);
              if (response.ok) {
                const data = await response.json();
                const serverStatus = data?.compleationStatus === "1" ? "completed" : "pending";
                ticketComponent.setStatus(serverStatus);
                setStatus(serverStatus);
              }
            } catch (error) {
              console.warn('Failed to check ticket status:', error);
            }
          } else {
            ticketComponent.setStatus('local');
          }
        }
      } catch (error) {
        console.error('Failed to render ticket:', error);
        setStatus('error');
      }
    };

    renderTicket();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [ticketCode, submissionData, eventName, scannerMode, isOffline, onBack]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  return (
    <div className="ticket-display-container">
      <div ref={containerRef} className="ticket-component-wrapper"></div>
      
      <div className="ticket-actions">
        <button className="btn-secondary" onClick={onBack}>
          ← Voltar
        </button>
        {status === 'local' && (
          <button 
            className="btn-primary"
            onClick={async () => {
              // Tentar reenviar
              try {
                const response = await fetch(`/${eventName}/submit`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    uniqueCode: ticketCode, 
                    submission: submissionData 
                  })
                });
                
                if (response.ok) {
                  setStatus('pending');
                  toast.success('Ticket enviado com sucesso!');
                }
              } catch (error) {
                toast.error('Falha ao enviar. Tente novamente.');
              }
            }}
          >
            🔄 Reenviar
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketDisplay;
