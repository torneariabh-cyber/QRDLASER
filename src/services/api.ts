import axios from 'axios'
import { CreateTicketData, TicketResponse, Ticket } from '../types'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  createTicket: async (data: CreateTicketData): Promise<TicketResponse> => {
    const response = await apiClient.post('/client/create-ticket', data)
    return response.data
  },

  getTicket: async (id: string): Promise<Ticket> => {
    const response = await apiClient.get(`/client/ticket/${id}`)
    return response.data
  },

  getTickets: async (): Promise<Ticket[]> => {
    const response = await apiClient.get('/operator/tickets')
    return response.data
  },

  getPendingTickets: async (): Promise<Ticket[]> => {
    const response = await apiClient.get('/operator/tickets/pending')
    return response.data
  },

  processTicket: async (id: string): Promise<{ success: boolean; ticket: Ticket }> => {
    const response = await apiClient.post(`/operator/process-ticket/${id}`)
    return response.data
  },

  scanTicket: async (id: string): Promise<Ticket> => {
    const response = await apiClient.get(`/operator/scan/${id}`)
    return response.data
  },
}
