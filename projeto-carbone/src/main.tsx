import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { CarrinhoProvider } from './contexts/CarrinhoContext'
import { ToastProvider } from './contexts/ToastContext'
import { registerServiceWorker } from './utils/pwa'

// Registrar Service Worker
if (import.meta.env.PROD) {
  registerServiceWorker();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <CarrinhoProvider>
          <App />
        </CarrinhoProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
