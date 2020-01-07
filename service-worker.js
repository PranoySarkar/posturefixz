let version = 1.3;

let cacheName = "posturefixz" + version;

let filesToCache = [
  "/posturefixz/",
	"/posturefixz/index.html",
	"/posturefixz/js/main.js",
	"/posturefixz/js/settings.js",
	"/posturefixz/js/NoSleep.min.js",
  "/posturefixz/css/main.css",
  "/posturefixz/assets/icons/icon.png",
  "/posturefixz/assets/audio/media.js",
  'https://fonts.googleapis.com/css?family=Open+Sans&display=swap'
];

self.addEventListener("install", function(event) {
	event.waitUntil(caches.open(cacheName).then((cache) =>{
		return cache.addAll(filesToCache);
	}));
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('service worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
    );
    return self.clients.claim();
});
