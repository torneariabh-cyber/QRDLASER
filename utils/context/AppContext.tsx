import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  tickets: any[];
  setTickets: (tickets: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [tickets, setTickets] = useState<any[]>([]);

  return (
    <AppContext.Provider value={{ isOnline, setIsOnline, tickets, setTickets }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
