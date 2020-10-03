const cacheName = 'KB-Cache';

const staticAssets = [
// outer
    '/',
    '/index.html',
    '/timeline.html',
    '/work.html',
    '/blog.html',
    '/resume.html',
// css
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css',
    'https://unpkg.com/aos@next/dist/aos.css',
    '/style.css',
// Font
    'https://kit.fontawesome.com/9b54928ef1.js',
// js
    'https://code.jquery.com/jquery-3.5.1.slim.min.js',
    'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js',
    'https://unpkg.com/typer-dot-js@0.1.0/typer.js',
    'https://unpkg.com/aos@next/dist/aos.js',
// assets
    '/assets/images/circle-cropped copy.png',
    // Add other two favicon if you need just uncomment below two.
    // '/assets/images/favicon-16x16.png',
    // '/assets/images/favicon-32x32.png',
    '/assets/images/undraw_Hello_qnas.svg',
    '/assets/images/projects/Techify Mockup.png',
    '/assets/images/projects/Quizzler.gif',
    '/assets/images/projects/Personal Portfolio Mockup.png',
    '/assets/images/projects/EggTimer.gif',
    '/assets/images/projects/Explorer Mockup.png',
    '/assets/images/projects/Xylophone.gif',
]

// Service worker install event
self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

// Service Worker is activated
self.addEventListener('activate', e => {
    self.clients.claim();
});

// fetch event
self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if (url.origin == location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkAndCache(req));
    }
});

// cache first matching cache 
async function cacheFirst(req) {
    const cache =  await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

// fetching new cache
async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}

