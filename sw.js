
const CACHE_NAME = 'GSM CLIENTS -reparation-v6';
const FILES = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) return res;
      return fetch(e.request).then((r) => {
        if (r.ok && e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
          let copy = r.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
        }
        return r;
      }).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
