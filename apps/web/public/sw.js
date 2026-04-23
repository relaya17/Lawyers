// Service Worker for LexStudy PWA
// Strategy:
//  - HTML navigations: NETWORK-FIRST (prevents stale index.html pointing to
//    missing chunk hashes after a new deploy — the root cause of broken PWAs).
//  - Hashed /assets/* (JS/CSS chunks): NETWORK-ONLY (Netlify already sets
//    immutable long-TTL headers; we must never serve stale hashed bundles).
//  - Static icons/manifest/offline page: cache-first with network fallback.
//  - API and WebSocket: never intercepted.
//  - Self-heal: if a chunk request returns HTML (Netlify SPA fallback) we
//    clear caches and unregister so the next reload gets a clean tree.

const CACHE_VERSION = "v1.2.0";
const CACHE_NAME = `lexstudy-static-${CACHE_VERSION}`;

// Only truly static resources are pre-cached. We intentionally DO NOT cache
// `/` or `/index.html` here — that would pin the shell to old bundle hashes.
const PRECACHE_URLS = [
  "/manifest.json",
  "/offline.html",
  "/apple-touch-icon-152.svg",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((u) =>
          cache.add(u).catch(() => {
            // Missing precache asset must not block SW install.
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
      await self.clients.claim();
    })()
  );
});

function isNavigationRequest(req) {
  if (req.mode === "navigate") return true;
  if (req.destination === "document") return true;
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/html");
}

function isHashedAsset(url) {
  return /\/assets\/.+\.(js|css|mjs|woff2?|ttf|otf|png|jpe?g|webp|svg|gif)$/.test(
    url.pathname
  );
}

async function selfHealAndReload() {
  try {
    const names = await caches.keys();
    await Promise.all(names.map((n) => caches.delete(n)));
    const regs = await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach((c) => c.navigate(c.url));
    return regs;
  } catch (_e) {
    // Ignore self-heal errors — SW will retry on next boot.
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Only handle same-origin requests. Cross-origin goes directly to network.
  if (url.origin !== self.location.origin) return;

  // API and WebSocket — never intercept.
  if (url.pathname.startsWith("/api/")) return;
  if (req.headers.get("upgrade") === "websocket") return;

  // Navigations → network-first, fallback to offline page.
  if (isNavigationRequest(req)) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          return fresh;
        } catch (_err) {
          const offline = await caches.match("/offline.html");
          return (
            offline ||
            new Response("<h1>Offline</h1>", {
              status: 503,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            })
          );
        }
      })()
    );
    return;
  }

  // Hashed build assets → network-only, self-heal on MIME mismatch.
  if (isHashedAsset(url)) {
    event.respondWith(
      (async () => {
        const response = await fetch(req);
        const ct = response.headers.get("content-type") || "";
        const isJsOrCss = /\.(js|mjs)$/.test(url.pathname)
          ? ct.includes("javascript") || ct.includes("ecmascript")
          : /\.css$/.test(url.pathname)
          ? ct.includes("css")
          : true;
        if (response.ok && !isJsOrCss) {
          // Netlify served index.html for a missing chunk — stale PWA shell.
          // Clear caches and unregister; the page reload will pick up the new
          // index.html with fresh chunk hashes.
          event.waitUntil(selfHealAndReload());
        }
        return response;
      })()
    );
    return;
  }

  // Other static GETs → cache-first with network fallback (and background
  // refresh so the next visit gets newer content).
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      const networkPromise = fetch(req)
        .then((resp) => {
          if (resp && resp.status === 200 && resp.type === "basic") {
            cache.put(req, resp.clone()).catch(() => {});
          }
          return resp;
        })
        .catch(() => null);

      if (cached) {
        event.waitUntil(networkPromise);
        return cached;
      }
      const network = await networkPromise;
      if (network) return network;
      return new Response("", { status: 504, statusText: "Offline" });
    })()
  );
});

self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data.type === "GET_VERSION" && event.ports && event.ports[0]) {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "התראה חדשה",
    icon: "/apple-touch-icon-152.svg",
    badge: "/apple-touch-icon-152.svg",
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1 },
    actions: [
      { action: "explore", title: "פתח אפליקציה", icon: "/apple-touch-icon-152.svg" },
    ],
  };
  event.waitUntil(self.registration.showNotification("LexStudy", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/"));
});
