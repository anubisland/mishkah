/**
 * مِشكاة | Mishkah Service Worker
 *
 * Two kinds of content, two strategies:
 * - The app itself (HTML, scripts, styles): network first, so every update is
 *   visible immediately; the last copy is kept only as an offline fallback.
 * - Quran content (mushaf page images, ayah text): it never changes, so once a
 *   page has been opened it is served from the device. A class keeps working
 *   when the connection is weak, and pages load instantly the second time.
 */

// Raised with window.MISHKAH_VERSION in index.html at every release.
const APP_CACHE = 'mishkah-app-v93';
const QURAN_CACHE = 'mishkah-quran-v1';
const QURAN_HOSTS = ['android.quran.com', 'api.alquran.cloud'];
// Libraries and fonts the app loads from CDNs: treated like the app's own
// files (fresh when online, last copy when offline).
const LIBRARY_HOSTS = ['unpkg.com', 'cdn.tailwindcss.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com'];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Drop old app caches; the Quran cache survives app updates.
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== APP_CACHE && key !== QURAN_CACHE).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

function isQuranRequest(url) {
  return QURAN_HOSTS.includes(url.hostname);
}

async function quranCacheFirst(request) {
  const cache = await caches.open(QURAN_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  // Opaque (no-cors) image responses have status 0 but are still usable.
  if (response.ok || response.type === 'opaque') {
    cache.put(request, response.clone()).catch((err) => console.warn('Mishkah SW: could not store Quran content', err));
  }
  return response;
}

async function appNetworkFirst(request) {
  try {
    const response = await fetch(request);
    // Opaque responses come from no-cors CDN requests (e.g. the Tailwind script).
    if (response.ok || response.type === 'opaque') {
      const cache = await caches.open(APP_CACHE);
      cache.put(request, response.clone()).catch((err) => console.warn('Mishkah SW: could not store app file', err));
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.pathname.includes('/api/')) return;

  if (isQuranRequest(url)) {
    event.respondWith(quranCacheFirst(request));
  } else if (url.origin === self.location.origin || LIBRARY_HOSTS.includes(url.hostname)) {
    event.respondWith(appNetworkFirst(request));
  }
});
