let version = 1.4;

let cacheName = "posturefixz" + version;

let filesToCache = [
  "/",
  "/index.html",
  "/js/main.js",
  "/js/settings.js",
  "/js/NoSleep.min.js",
  "/css/main.css",
  "/assets/screen.png",
  "/assets/icons/icon.png",
  "/assets/icons/facebook.png",
  "/assets/icons/twitter.png",
  "/assets/icons/whatsapp_share.png",
  "/assets/audio/media.js",
  "/assets/tshirt-with-pocket.png",
  'https://fonts.googleapis.com/css?family=Open+Sans&display=swap'
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    return cache.addAll(filesToCache);
  }));
});

self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('clean-cache')) {
    console.log('Cache cleared')
    caches.delete(cacheName);
  }
  event.respondWith(caches.match(event.request).then(function (response) {
    return response || fetch(event.request);
  })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('service worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});
