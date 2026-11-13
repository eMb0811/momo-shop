/**
 * momoShop Service Worker
 * High-performance offline caching & PWA runtime for Dakar streetwear boutique
 */

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `momoshop-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `momoshop-runtime-${CACHE_VERSION}`;

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/images/logo.png',
  '/images/hero_3d_trio.jpg',
  '/images/hero_3d_black.jpg',
  '/images/hero_3d_terracotta.jpg',
];

// Offline HTML fallback for navigation
const OFFLINE_FALLBACK_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>momoShop — Mode Hors-Ligne</title>
  <style>
    body {
      margin: 0;
      padding: 2rem;
      background-color: #f6f4ee;
      color: #0d0d11;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      box-sizing: border-box;
    }
    .badge {
      display: inline-block;
      background-color: #ffd600;
      color: #0d0d11;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
      box-shadow: 2px 2px 0 0 #0d0d11;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0 0 0.75rem;
      letter-spacing: -0.02em;
    }
    p {
      color: #6b6a72;
      max-width: 420px;
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0 0 1.5rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      background-color: #0d0d11;
      color: #ffffff;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 3px 3px 0 0 #ff4d1c;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="badge">📡 Connexion Interrompue</div>
  <h1>momoShop Dakar</h1>
  <p>Vous naviguez actuellement en mode hors-ligne. Votre panier et vos sélections restent enregistrés dans votre navigateur.</p>
  <button class="btn" onclick="window.location.reload()">Réessayer la connexion</button>
</body>
</html>`;

// Install Event: precache core assets and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Use map with catch to ensure install succeeds even if one asset fails
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Precache failed for ${url}:`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: purge stale caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== RUNTIME_CACHE) {
            console.log(`[SW] Cleaning obsolete cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper to determine if a URL is static
function isStaticAsset(url) {
  const pathname = url.pathname;
  return (
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/_next/static/') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js')
  );
}

// Fetch Event: apply network-first for navigation, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests with http/https schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Bypass Next.js hot module reload & development routes
  if (url.pathname.includes('/_next/webpack-hmr') || url.pathname.startsWith('/api/')) {
    return;
  }

  // 1. Navigation requests (HTML pages): Network-First with cache & offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // If network fails, try exact cached page
          const cachedPage = await caches.match(request);
          if (cachedPage) {
            return cachedPage;
          }

          // Fallback to home page from cache
          const cachedHome = await caches.match('/');
          if (cachedHome) {
            return cachedHome;
          }

          // Fallback to inline offline HTML
          return new Response(OFFLINE_FALLBACK_HTML, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        })
    );
    return;
  }

  // 2. Static assets (/fonts/, /images/, logo, CSS, JS): Cache-First
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          // Cache successful or opaque responses (e.g. cross-origin fonts/images)
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Other requests: Network-First with runtime cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
