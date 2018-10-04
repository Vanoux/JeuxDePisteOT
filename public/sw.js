var cacheName = 'stgo';
var filesToCache = [
    'img/act1.jpg',
    'img/act2.jpg',
    'img/3animals.jpg',
    'img/blason.jpg',
    'img/ccc.png',
    'img/chapiteau.jpg',
    'img/cloche.jpg',
    'img/compass-icon.png',
    'img/griffon.jpg',
    'img/hand.jpg',
    'img/Hibou1-ConvertIma.png',
    'img/Hibou1.png',
    'img/HibouMarker.png',
    'img/lions.jpg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
