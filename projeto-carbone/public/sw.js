const CACHE_NAME = 'roma-v1.0.0';
const STATIC_CACHE = 'roma-static-v1';
const DYNAMIC_CACHE = 'roma-dynamic-v1';

// Arquivos para cache estático
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Cacheando arquivos estáticos');
      return cache.addAll(STATIC_FILES);
    })
  );
  
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('[SW] Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Estratégias de cache
const cacheFirst = async (request) => {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  return cached || fetch(request);
};

const networkFirst = async (request) => {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
};

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    cache.put(request, response.clone());
    return response;
  });
  
  return cached || fetchPromise;
};

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Estratégia para diferentes tipos de recursos
  if (request.destination === 'document') {
    // HTML - Network First
    event.respondWith(networkFirst(request));
  } else if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    // CSS, JS, Fonts - Cache First
    event.respondWith(cacheFirst(request));
  } else if (request.destination === 'image') {
    // Imagens - Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else if (url.pathname.startsWith('/api/')) {
    // API - Network Only
    event.respondWith(fetch(request));
  } else {
    // Outros - Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Implementar lógica de sincronização
      syncData()
    );
  }
});

async function syncData() {
  // Lógica de sincronização quando voltar online
  console.log('[SW] Sincronizando dados...');
}

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'ROMA';
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notificação clicada:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Mensagem recebida:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});
