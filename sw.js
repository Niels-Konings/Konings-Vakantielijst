// Cache versie: BUMP DEZE bij elke deploy om gebruikers de nieuwe versie te geven
const CACHE = 'koningslijst-v16';

// Lokale assets (pre-cache)
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Domeinen die we mogen cachen (CORS responses, fonts, react cdn)
const CACHEABLE_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'unpkg.com',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(LOCAL_ASSETS))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isCacheableHost(url) {
  try {
    const u = new URL(url);
    return CACHEABLE_HOSTS.includes(u.host);
  } catch (e) {
    return false;
  }
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // JSONBin calls nooit cachen, anders blijft sync stuck
  if (e.request.url.includes('api.jsonbin.io')) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      return (
        cached ||
        fetch(e.request)
          .then((response) => {
            if (!response || response.status !== 200) return response;
            // Cache lokale (basic) en whitelisted CORS responses (fonts, react cdn)
            const shouldCache =
              response.type === 'basic' ||
              (response.type === 'cors' && isCacheableHost(e.request.url));
            if (shouldCache) {
              const clone = response.clone();
              caches.open(CACHE).then((cache) => cache.put(e.request, clone));
            }
            return response;
          })
          .catch(() => cached)
      );
    })
  );
});
