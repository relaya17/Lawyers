/**
 * LexStudy Service Worker v2.0.0 — Clean-slate strategy
 *
 * Previous versions used cache-first for /assets/* which caused "MIME text/html"
 * crashes when Netlify deployed new chunk hashes. This version:
 *
 *  1. On install  → deletes ALL previous caches immediately
 *  2. On activate → claims all clients so the new SW takes over at once
 *  3. On fetch    → NEVER caches hashed assets (/assets/*); always network
 *                   HTML navigations: network-first with offline fallback
 *                   Other static (icons, manifest): stale-while-revalidate
 *
 * This guarantees that every new Netlify deploy is picked up on the first
 * request — no stale chunks, no MIME-type crashes.
 */

const CACHE_VERSION = 'lexstudy-v2.0.0';

// Only genuinely static, version-independent files are pre-cached.
// /assets/* are intentionally excluded — they have content-hashed names
// and must NEVER be served from cache (old hash = old file = MIME crash).
const STATIC_PRECACHE = [
  '/manifest.json',
  '/offline.html',
  '/favicon.ico',
  '/apple-touch-icon-152.svg',
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // Wipe every cache from previous SW versions first.
      const existing = await caches.keys();
      await Promise.all(existing.map((k) => caches.delete(k)));

      // Pre-cache only truly static assets.
      const cache = await caches.open(CACHE_VERSION);
      await Promise.allSettled(
        STATIC_PRECACHE.map((url) =>
          cache.add(url).catch(() => { /* missing asset must not block */ }),
        ),
      );

      // Take over immediately without waiting for old SW clients to close.
      self.skipWaiting();
    })(),
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Delete any leftover caches that aren't from this version.
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)),
      );
      // Take control of all open pages immediately.
      await self.clients.claim();
    })(),
  );
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only GET, only same-origin, skip non-http.
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.protocol.startsWith('http')) return;

  // API and WebSocket — never intercept.
  if (url.pathname.startsWith('/api/')) return;
  if (req.headers.get('upgrade') === 'websocket') return;

  // ── Hashed build assets: NETWORK ONLY ──────────────────────────────────
  // /assets/ files have content hashes in their names (e.g. index-A3f9k.js).
  // Netlify sets Cache-Control: immutable on these, so the browser caches them
  // natively. We must NOT cache them in the SW — a stale SW cache would serve
  // the old hash after a new deploy, causing the MIME-type crash.
  if (url.pathname.startsWith('/assets/')) {
    // Pass directly to network. If it fails (offline) the app shows an error
    // which is the correct behavior — we can't serve a stale JS bundle.
    return; // let the browser handle it natively
  }

  // ── HTML navigations: NETWORK FIRST ────────────────────────────────────
  // Always fetch a fresh index.html so the shell always references the latest
  // chunk hashes from the current Netlify deploy.
  const isNavigation =
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    (req.headers.get('accept') ?? '').includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .catch(async () => {
          const cached = await caches.match('/offline.html');
          return (
            cached ??
            new Response('<h1>Offline</h1>', {
              status: 503,
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            })
          );
        }),
    );
    return;
  }

  // ── Other static (icons, manifest, etc.): STALE-WHILE-REVALIDATE ───────
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(req);

      const networkFetch = fetch(req).then((res) => {
        if (res.ok && res.type === 'basic') {
          cache.put(req, res.clone()).catch(() => {});
        }
        return res;
      }).catch(() => null);

      // Return cached immediately while refreshing in the background.
      if (cached) {
        event.waitUntil(networkFetch);
        return cached;
      }

      const fresh = await networkFetch;
      return fresh ?? new Response('', { status: 504 });
    })(),
  );
});

// ─── Push notifications ──────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'התראה חדשה מ-LexStudy',
    icon: '/apple-touch-icon-152.svg',
    badge: '/apple-touch-icon-152.svg',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now() },
  };
  event.waitUntil(self.registration.showNotification('LexStudy', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/'));
});

// ─── Message channel ─────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data.type === 'GET_VERSION' && event.ports?.[0]) {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});
