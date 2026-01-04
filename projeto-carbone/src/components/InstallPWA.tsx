import React, { useEffect, useState } from 'react';
import { isPWAInstalled, setupInstallPrompt, installPWA } from '../utils/pwa';
import './InstallPWA.css';

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Não mostrar se já estiver instalado
    if (isPWAInstalled()) {
      return;
    }

    // Setup do prompt de instalação
    setupInstallPrompt((event) => {
      setDeferredPrompt(event);
      setShowInstall(true);
    });

    // Verificar se já foi dispensado antes
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSince = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Mostrar novamente após 7 dias
      if (daysSince < 7) {
        setShowInstall(false);
      }
    }
  }, []);

  const handleInstall = async () => {
    const installed = await installPWA(deferredPrompt);
    if (installed) {
      setShowInstall(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstall(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  if (!showInstall || !deferredPrompt) {
    return null;
  }

  return (
    <div className="install-pwa-banner">
      <div className="install-pwa-content">
        <div className="install-pwa-icon">📱</div>
        <div className="install-pwa-text">
          <h3>Instalar ROMA</h3>
          <p>Acesse rapidamente e use offline!</p>
        </div>
        <div className="install-pwa-actions">
          <button onClick={handleInstall} className="btn-install">
            Instalar
          </button>
          <button onClick={handleDismiss} className="btn-dismiss">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
