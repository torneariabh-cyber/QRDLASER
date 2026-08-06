import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'
import { useSocket } from '../../hooks/useSocket'
import { api } from '../../services/api'
import { Ticket } from '../../types'
import FontSelector from './FontSelector'
import IconSelector from './IconSelector'
import LivePreview from './LivePreview'
import TicketResult from './TicketResult'
import './styles/ClientPage.css'

const ClientPage: React.FC = () => {
  const [name, setName] = useState('')
  const [selectedFont, setSelectedFont] = useState('Arial')
  const [selectedIcon, setSelectedIcon] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [showResult, setShowResult] = useState(false)
  
  const socket = useSocket()
  const navigate = useNavigate()

  // Atualizar status do ticket via socket
  useEffect(() => {
    if (!socket) return

    const handleTicketUpdate = (updatedTicket: Ticket) => {
      if (ticket && updatedTicket.id === ticket.id) {
        setTicket(updatedTicket)
        if (updatedTicket.status === 'processed') {
          toast.success('✅ Seu ticket foi processado com sucesso!')
        } else if (updatedTicket.status === 'error') {
          toast.error('❌ Erro ao processar seu ticket. Tente novamente.')
        }
      }
    }

    socket.on('ticket-updated', handleTicketUpdate)
    socket.on('ticket-processed', handleTicketUpdate)
    socket.on('ticket-error', handleTicketUpdate)

    return () => {
      socket.off('ticket-updated', handleTicketUpdate)
      socket.off('ticket-processed', handleTicketUpdate)
      socket.off('ticket-error', handleTicketUpdate)
    }
  }, [socket, ticket])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Por favor, digite seu nome.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await api.createTicket({
        name: name.trim(),
        font: selectedFont,
        icon: selectedIcon,
      })

      if (response.success) {
        setTicket(response.ticket)
        setShowResult(true)
        toast.success('🎉 Ticket criado com sucesso!')
        
        // Registrar cliente no socket
        if (socket) {
          socket.emit('register-client', response.ticketId)
        }
      }
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Erro ao criar ticket. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewDesign = () => {
    setShowResult(false)
    setTicket(null)
    setName('')
    setSelectedFont('Arial')
    setSelectedIcon('')
  }

  if (showResult && ticket) {
    return (
      <div className="client-page">
        <div className="container">
          <TicketResult ticket={ticket} onNewDesign={handleNewDesign} />
        </div>
      </div>
    )
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

            <div className="form-group">
              <label>
                <span className="label-icon">🔤</span>
                Escolha a Fonte
              </label>
              <FontSelector
                selectedFont={selectedFont}
                onSelectFont={setSelectedFont}
              />
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">🎯</span>
                Escolha um Ícone
              </label>
              <IconSelector
                selectedIcon={selectedIcon}
                onSelectIcon={setSelectedIcon}
              />
            </div>

            <LivePreview
              name={name || 'Seu Nome'}
              font={selectedFont}
              icon={selectedIcon}
            />

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
  )
}

export default ClientPage
