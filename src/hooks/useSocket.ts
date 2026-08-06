import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Tenta conectar ao backend
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket conectado!');
      setIsConnected(true);
      setSocket(socketInstance);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('⚠️ Erro na conexão Socket:', error);
      setIsConnected(false);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket desconectado');
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};
