/* ============================================================
   Service Worker — mimo PWA
   Strategies: Cache-First for static, Network-First for pages
   ============================================================ */

const CACHE_NAME = 'mimo-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/docs.html',
    '/token.html',
    '/blog.html',
    '/whitepaper.html',
    '/styles.css',
    '/script.js',
    '/wallet.js',
    '/gsap-init.js',
    '/analytics.js',
    '/manifest.json',
    '/icon-192.svg',
    '/icon-512.svg',
];

const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
];

/* ---- Install ---- */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([...STATIC_ASSETS, ...EXTERNAL_ASSETS]);
        })
    );
    self.skipWaiting();
});

/* ---- Activate ---- */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

/* ---- Fetch — Network First for HTML, Cache First for assets ---- */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET
    if (request.method !== 'GET') return;

    // Skip chrome-extension and other non-http
    if (!url.protocol.startsWith('http')) return;

    // HTML pages — Network First
    if (request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Static assets — Cache First
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;

            return fetch(request).then((response) => {
                // Only cache same-origin and successful responses
                if (!response || response.status !== 200 || url.origin !== location.origin) {
                    return response;
                }

                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                return response;
            });
        })
    );
});
