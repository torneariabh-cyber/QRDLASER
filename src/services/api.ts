import axios from 'axios';

const API_URL = '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Criar ticket
  createTicket: async (data: { name: string; font: string; icon: string }) => {
    try {
      console.log('Enviando para API:', data);
      const response = await apiClient.post('/client/create-ticket', data);
      console.log('Resposta da API:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro na API:', error);
      // Se o backend não estiver rodando, simular resposta
      if (error.code === 'ERR_NETWORK') {
        console.warn('Backend não encontrado, simulando resposta...');
        return {
          success: true,
          ticketId: 'SIM-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          qrCode: `/qr-codes/sim-${Date.now()}.png`,
          ticket: {
            id: 'SIM-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            name: data.name,
            font: data.font,
            icon: data.icon,
            status: 'pending',
            qrCode: `/qr-codes/sim-${Date.now()}.png`,
            createdAt: new Date().toISOString()
          }
        };
      }
      throw error;
    }
  },

  // Buscar ticket
  getTicket: async (id: string) => {
    try {
      const response = await apiClient.get(`/client/ticket/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar ticket:', error);
      throw error;
    }
  },

  // Processar ticket
  processTicket: async (id: string) => {
    try {
      const response = await apiClient.post(`/operator/process-ticket/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao processar ticket:', error);
      throw error;
    }
  }
};
