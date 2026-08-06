echo import React, { createContext, useContext, useState, ReactNode } from 'react' > src\context\AppContext.tsx
echo. >> src\context\AppContext.tsx
echo interface AppContextType { >> src\context\AppContext.tsx
echo   theme: 'dark' | 'light'; >> src\context\AppContext.tsx
echo   toggleTheme: () => void; >> src\context\AppContext.tsx
echo } >> src\context\AppContext.tsx
echo. >> src\context\AppContext.tsx
echo const AppContext = createContext^<AppContextType | undefined^>(undefined); >> src\context\AppContext.tsx
echo. >> src\context\AppContext.tsx
echo export const AppProvider: React.FC^<{ children: ReactNode }^> = ({ children }) =^> { >> src\context\AppContext.tsx
echo   const [theme, setTheme] = useState^<'dark' | 'light'^>('dark'); >> src\context\AppContext.tsx
echo   const toggleTheme = () =^> setTheme(theme === 'dark' ? 'light' : 'dark'); >> src\context\AppContext.tsx
echo   return ( >> src\context\AppContext.tsx
echo     ^<AppContext.Provider value={{ theme, toggleTheme }}^> >> src\context\AppContext.tsx
echo       {children} >> src\context\AppContext.tsx
echo     ^</AppContext.Provider^> >> src\context\AppContext.tsx
echo   ); >> src\context\AppContext.tsx
echo }; >> src\context\AppContext.tsx
echo. >> src\context\AppContext.tsx
echo export const useApp = () =^> { >> src\context\AppContext.tsx
echo   const context = useContext(AppContext); >> src\context\AppContext.tsx
echo   if (!context) throw new Error('useApp must be used within AppProvider'); >> src\context\AppContext.tsx
echo   return context; >> src\context\AppContext.tsx
echo }; >> src\context\AppContext.tsx
