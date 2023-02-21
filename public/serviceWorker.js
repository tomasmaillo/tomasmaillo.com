// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const cacheName = 'tomasmaillo-cache';

// Replace the following with the correct offline fallback page
const offlineFallbackPage = "/offline.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', function (event) {
  event.respondWith(async function () {
    try {
      var res = await fetch(event.request);
      var cache = await caches.open('cache');
      cache.put(event.request.url, res.clone());
      return res;
    }
    catch (error) {
      return caches.match(event.request);
    }
  }());
});


// TODO: Cache routes with /*
// currently, they are being blocked :D

// // during the install phase you usually want to cache static assets
// self.addEventListener('install', function (e) {
//   // once the SW is installed, go ahead and fetch the resources to make this work offline
//   e.waitUntil(
//     caches.open(cacheName).then(function (cache) {
//       return cache.addAll([
//         './',
//         './static/*',
//         './projectImages/*',
//         './models/*',
//         './linkPreviewMedia/*',
//         './css/style.css',
//         './offline.html'
//       ]).then(function () {
//         self.skipWaiting();
//       });
//     })
//   );
// });

// // when the browser fetches a url
// self.addEventListener('fetch', function (event) {
//   // either respond with the cached object or go ahead and fetch the actual url
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       if (response) {
//         // retrieve from cache
//         return response;
//       }
//       // fetch as normal
//       return fetch(event.request);
//     })
//   );
// });
