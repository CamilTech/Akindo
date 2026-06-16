const CACHE_NAME = 'fashion-pwa-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/style.css',
  './assets/js/main.js',
  './assets/js/sw-register.js',
  './assets/css/pintura.css',
  './assets/js/pagina-inicial.js',
  './assets/css/login.css',
  './assets/js/login.js',
  './pages/pagina-inicial.html',
  './pages/login.html',
  './pages/loading-fashion.html',
  './pages/fashion-character.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    ))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestURL = new URL(event.request.url);
  const isNavigationRequest = event.request.mode === 'navigate';

  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            return response;
          }
          return caches.match('./index.html');
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request)
        .then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          if (event.request.destination === 'image') {
            return caches.match('./img/logo.png');
          }
        })
      )
  );
});
