import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Ticket } from '../../types'

interface TicketResultProps {
  ticket: Ticket
  onNewDesign: () => void
}

const TicketResult: React.FC<TicketResultProps> = ({ ticket, onNewDesign }) => {
  const getStatusInfo = (status: Ticket['status']) => {
    const map = {
      pending: { text: 'Aguardando processamento...', dot: 'pending' },
      processing: { text: '⏳ Processando...', dot: 'processing' },
      processed: { text: '✅ Processado com sucesso!', dot: 'processed' },
      error: { text: '❌ Erro no processamento', dot: 'error' },
    }
    return map[status] || map.pending
  }

  const statusInfo = getStatusInfo(ticket.status)

  return (
    <div className="result-card animate-fade-in">
      <div className="result-icon">✅</div>
      <h2>Ticket Criado!</h2>
      <p>Seu design foi enviado para o operador</p>

      <div className="qr-code-container">
        <div className="qr-code-wrapper">
          <QRCodeSVG
            value={JSON.stringify({ id: ticket.id, name: ticket.name })}
            size={160}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        <div className="ticket-info">
          <p className="ticket-id-label">ID do Ticket</p>
          <p className="ticket-id-value">{ticket.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="status-container">
        <div className="status-indicator">
          <span className={`status-dot ${statusInfo.dot}`}></span>
          {statusInfo.text}
        </div>
      </div>

      <button
        className="btn-secondary"
        onClick={onNewDesign}
        style={{ marginTop: '16px' }}
      >
        ✨ Novo Design
      </button>
    </div>
  )
}

export default TicketResult
