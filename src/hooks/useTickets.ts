import { useState } from 'react';
import { api } from '../services/api';

export const useTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTicket = async (data: { name: string; font: string; icon: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.createTicket(data);
      return result;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createTicket, loading, error };
};
