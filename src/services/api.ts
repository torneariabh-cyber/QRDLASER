import axios from 'axios';

// Usar a URL completa para o backend
const API_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  createTicket: async (data: { name: string; font: string; icon: string }) => {
    try {
      console.log('📤 Enviando para API:', data);
      console.log('📍 URL:', `${API_URL}/client/create-ticket`);
      
      const response = await apiClient.post('/client/create-ticket', data);
      console.log('📥 Resposta:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na API:', error);
      
      // Se o backend não responder, simular
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.warn('⚠️ Backend offline, simulando resposta...');
        const ticketId = 'SIM-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        return {
          success: true,
          ticketId: ticketId,
          qrCode: `/qr-codes/sim-${Date.now()}.png`,
          ticket: {
            id: ticketId,
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

  getTicket: async (id: string) => {
    try {
      const response = await apiClient.get(`/client/ticket/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar ticket:', error);
      throw error;
    }
  },

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
