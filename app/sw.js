/* OAF Connect — service worker.
   Stratégie : réseau d'abord (toujours la dernière version en ligne), repli
   sur le cache uniquement hors-ligne. Mise à jour automatique : le nouveau
   worker prend le contrôle immédiatement et la page se recharge toute seule
   (voir l'enregistrement dans index.html). Bump CACHE à chaque évolution. */
const CACHE = 'oaf-connect-v55';
const ASSETS = [
  './', './index.html', './admin.html',
  './style.css', './store.js', './app.js', './admin.js',
  './config.js', './supabase.js',
  './manifest.webmanifest', './icon.svg',
  './icon-180.png', './icon-192.png', './icon-512.png'
];

self.addEventListener('install', e => {
  // Le nouveau worker s'active sans attendre la fermeture des onglets.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  // On supprime TOUS les anciens caches (pas seulement ceux d'une autre version)
  // pour éliminer tout mélange ancien/nouveau, puis on prend le contrôle.
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Permet à la page de forcer l'activation du worker en attente.
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const sameOrigin = new URL(e.request.url).origin === self.location.origin;
  // SÉCURITÉ : on ne met en cache QUE nos propres fichiers (même origine). Les
  // réponses de l'API (Supabase : profils, messages, RDV…) ne sont JAMAIS mises
  // en cache, pour éviter qu'une donnée personnelle reste lisible après
  // déconnexion sur un appareil partagé. Le cross-origin passe directement au
  // réseau, sans interception.
  if (!sameOrigin) return;
  // Réseau d'abord, en CONTOURNANT le cache HTTP du navigateur (no-store) :
  // iOS/Safari sert parfois un ancien .js même si le HTML est à jour, ce qui
  // mélange ancien et nouveau code. On force une vraie requête réseau, on met
  // notre cache à jour, et on ne sert le cache que si le réseau est réellement
  // indisponible (hors-ligne).
  const req = new Request(e.request, { cache: 'no-store' });
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});
