// NatureKart PWA Service Worker
const CACHE_NAME = 'naturekart-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/apple-touch-icon.svg',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API calls
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache successful responses for static assets
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Update from NatureKart',
      icon: data.icon || '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/orders',
        dateOfArrival: Date.now(),
      },
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
      tag: data.tag || 'naturekart-push',
      renotify: true,
      requireInteraction: true,
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'NatureKart', options)
    );
  } catch {
    // Simple text notification
    event.waitUntil(
      self.registration.showNotification('NatureKart', {
        body: event.data.text(),
        icon: '/favicon.svg',
      })
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/orders';

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const matchingClient = windowClients.find((client) => {
        return client.url.includes(urlToOpen);
      });

      if (matchingClient) {
        return matchingClient.focus();
      }

      return clients.openWindow(urlToOpen);
    })
  );
});

// Periodic sync for background updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-orders') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_ORDERS' });
        });
      })
    );
  }
});
