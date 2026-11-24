const CACHE_NAME = 'op-tracker-v3';
const CORE_ASSETS = [
    './',
    './index.html',
    './config.json',
    './manifest.json',
    './icon.svg',
    './icon-192.png',
    './icon-512.png',
    './icon-maskable-512.png',
    './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)))
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    const isSameOrigin = url.origin === self.location.origin;
    const isDynamic =
        req.mode === 'navigate' ||
        req.destination === 'document' ||
        (isSameOrigin && url.pathname.endsWith('/config.json'));

    // HTML e config.json: rede primeiro para refletir edições do Pages CMS rapidamente
    if (isDynamic) {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    if (res && res.status === 200) {
                        const copy = res.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                    }
                    return res;
                })
                .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
        );
        return;
    }

    // Tailwind CDN e Google Fonts: stale-while-revalidate para manter o visual 100% offline
    if (
        url.hostname === 'cdn.tailwindcss.com' ||
        url.hostname === 'fonts.googleapis.com' ||
        url.hostname === 'fonts.gstatic.com'
    ) {
        event.respondWith(
            caches.match(req).then((cached) => {
                const networkFetch = fetch(req)
                    .then((res) => {
                        if (res && (res.status === 200 || res.type === 'opaque')) {
                            const copy = res.clone();
                            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                        }
                        return res;
                    })
                    .catch(() => cached);
                return cached || networkFetch;
            })
        );
        return;
    }

    // Imagens e demais arquivos do próprio repositório: cache primeiro com preenchimento automático
    if (isSameOrigin) {
        event.respondWith(
            caches.match(req).then((cached) => {
                if (cached) return cached;
                return fetch(req).then((res) => {
                    if (res && res.status === 200) {
                        const copy = res.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                    }
                    return res;
                });
            })
        );
    }
});
