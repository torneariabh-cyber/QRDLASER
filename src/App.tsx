import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import ClientPage from './components/client/ClientPage'
import OperatorPage from './components/operator/OperatorPage'

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255, 215, 0, 0.1)',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/client" replace />} />
            <Route path="/client" element={<ClientPage />} />
            <Route path="/operator" element={<OperatorPage />} />
            <Route path="*" element={<Navigate to="/client" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
