/* OAF Connect — service worker (network-first: toujours la dernière version en
   ligne, repli sur le cache hors-ligne). Bump CACHE à chaque évolution majeure. */
const CACHE = 'oaf-connect-v13';
const ASSETS = [
  './', './index.html', './admin.html',
  './style.css', './store.js', './app.js', './admin.js',
  './config.js', './supabase.js',
  './manifest.webmanifest', './icon.svg',
  './icon-180.png', './icon-192.png', './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Réseau d'abord : on récupère la version à jour, on met le cache à jour,
  // et on ne sert le cache que si le réseau est indisponible (hors-ligne).
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});
