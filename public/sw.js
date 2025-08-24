// Service Worker for ContractLab Pro PWA
// Service Worker עבור PWA

const CACHE_NAME = "contractlab-pro-v1.0.0";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/apple-touch-icon-152.svg",
  "/favicon.ico",
];

// iOS Safari specific cache strategy
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// התקנת Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );

  // Force activation for iOS
  if (isIOS) {
    self.skipWaiting();
  }
});

// הפעלת Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Claim clients for iOS
  if (isIOS) {
    event.waitUntil(self.clients.claim());
  }
});

// Intercept network requests
self.addEventListener("fetch", (event) => {
  // iOS Safari specific handling
  if (isIOS && event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // החזר מהמטמון אם קיים
        if (response) {
          return response;
        }

        // אחרת, בקש מהרשת
        return fetch(event.request)
          .then((response) => {
            // בדוק אם התקבלה תגובה תקינה
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            // שמור במטמון
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch((error) => {
            console.warn("Fetch failed for:", event.request.url, error);
            // Fallback for offline
            if (event.request.destination === "document") {
              return caches.match("/offline.html");
            }
            // Return empty response for other requests
            return new Response("", { status: 404, statusText: "Not Found" });
          });
      })
    );
  } else {
    // Regular handling for other browsers
    event.respondWith(
      caches.match(event.request).then((response) => {
        // החזר מהמטמון אם קיים
        if (response) {
          return response;
        }

        // אחרת, בקש מהרשת
        return fetch(event.request)
          .then((response) => {
            // בדוק אם התקבלה תגובה תקינה
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            // שמור במטמון
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch((error) => {
            console.warn("Fetch failed for:", event.request.url, error);
            // החזר תגובה ריקה במקרה של שגיאה
            return new Response("", { status: 404, statusText: "Not Found" });
          });
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "התראה חדשה מ-ContractLab Pro",
    icon: "/apple-touch-icon-152.svg",
    badge: "/apple-touch-icon-152.svg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "פתח אפליקציה",
        icon: "/apple-touch-icon-152.svg",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("ContractLab Pro", options)
  );
});

// Click on notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync any pending data
    console.log("Background sync completed");
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// iOS Safari specific message handling
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Cache First strategy with better error handling
async function cacheFirst(request) {
  try {
    // Try to get from cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If not in cache, try to fetch from network
    const networkResponse = await fetch(request);

    // Check if response is valid
    if (!networkResponse || networkResponse.status !== 200) {
      // If network request failed, return offline page
      const offlineResponse = await caches.match("/offline.html");
      if (offlineResponse) {
        return offlineResponse;
      }
      return new Response("Service Unavailable", { status: 503 });
    }

    // Clone the response and cache it
    const responseToCache = networkResponse.clone();
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, responseToCache);

    return networkResponse;
  } catch (error) {
    console.warn("Cache First strategy failed:", error);

    // Return offline page or fallback response
    const offlineResponse = await caches.match("/offline.html");
    if (offlineResponse) {
      return offlineResponse;
    }

    // Fallback response for API requests
    if (
      request.url.includes("/api/") ||
      request.url.includes("risk-analysis")
    ) {
      return new Response(
        JSON.stringify({
          error: "Service unavailable",
          message: "Please check your connection and try again",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // For other requests, return a simple offline message
    return new Response("Service Unavailable", { status: 503 });
  }
}
