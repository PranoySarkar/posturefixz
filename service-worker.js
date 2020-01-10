let version = 1.19;

let cacheName = "posturefixz" + version;

let filesToCache = [
  "/posturefixz/",
  "/posturefixz/index.html",
  "/posturefixz/js/main.js",
  "/posturefixz/js/settings.js",
  "/posturefixz/js/NoSleep.min.js",
  "/posturefixz/css/main.css",
  "/posturefixz/assets/screen.jpg",
  "/posturefixz/assets/icons/icon.png",
  "/posturefixz/assets/icons/facebook.jpg",
  "/posturefixz/assets/icons/twitter.jpg",
  "/posturefixz/assets/icons/whatsapp_share.jpg",
  "/posturefixz/assets/audio/negative.json",
  "/posturefixz/assets/audio/positive.json",
  "/posturefixz/assets/audio/reposition.json",
  "/posturefixz/assets/tshirt-with-pocket.jpg",
  "/posturefixz/assets/girl_with_pouch.jpg",
  'https://fonts.googleapis.com/css?family=Open+Sans&display=swap',
  'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2',
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(cacheName).then((cache) => {
    console.log('installed successfully')
    return cache.addAll(filesToCache);
  }));
});

self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('clean-cache')) {
    console.log('Cache cleared')
    caches.delete(cacheName);
  }
  event.respondWith(caches.match(event.request).then(function (response) {
    if(response){
      console.log('served form cache')
    }else{
      console.log('Not serving from cache ',event.request.url)
    }
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
