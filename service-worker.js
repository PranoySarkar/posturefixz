let version = 1.40;

let cacheName = "posturecorrector" + version;

let filesToCache = [
  "/",
  "/index.html",
  "/js/main.js",
  "/js/accelerometer.js",
  "/js/settings.js",
  "/js/NoSleep.min.js",
  "/css/main.css",
  "/assets/posture-corrector.jpg",
  "/assets/icons/icon.png",
  "/assets/icons/facebook.jpg",
  "/assets/icons/twitter.jpg",
  "/assets/icons/whatsapp_share.jpg",
  "/assets/audio/negative.json",
  "/assets/audio/positive.json",
  "/assets/audio/reposition.json",
  "/assets/tshirt-with-pocket.jpg",
  "/assets/girl_with_pouch.jpg",
  "/assets/iphone-issue.jpg",
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
