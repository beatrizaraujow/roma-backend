// Registrar Service Worker e gerenciar PWA

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registrado:', registration.scope);

      // Verificar atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 Nova versão do Service Worker encontrada');

        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão disponível
            if (confirm('Nova versão disponível! Deseja atualizar?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });

      return registration;
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
    }
  } else {
    console.warn('⚠️ Service Worker não suportado neste navegador');
  }
};

// Verificar se é PWA instalado
export const isPWAInstalled = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};

// Prompt de instalação
export const setupInstallPrompt = (onInstallable: (event: any) => void) => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    onInstallable(e);
  });
};

// Instalar PWA
export const installPWA = async (deferredPrompt: any) => {
  if (!deferredPrompt) return false;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  console.log(`Instalação: ${outcome}`);
  return outcome === 'accepted';
};

// Verificar status online/offline
export const setupOnlineStatus = (
  onOnline: () => void,
  onOffline: () => void
) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

// Requisitar permissão para notificações
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Enviar notificação
export const sendNotification = (title: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          ...options,
        });
      });
    } else {
      new Notification(title, options);
    }
  }
};

// Compartilhar via Web Share API
export const shareContent = async (data: ShareData) => {
  if ('share' in navigator) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      return false;
    }
  }
  return false;
};

// Cache de URLs específicas
export const cacheUrls = async (urls: string[]) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_URLS',
      urls,
    });
  }
};
