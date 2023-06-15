/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/*
  dependencies
*/

import {precacheAndRoute} from 'workbox-precaching'
import {registerRoute} from 'workbox-routing'
import {StaleWhileRevalidate} from 'workbox-strategies'
import {CacheFirst} from 'workbox-strategies'
import {ExpirationPlugin} from 'workbox-expiration'
import {CacheableResponsePlugin} from 'workbox-cacheable-response'
import {NetworkFirst} from 'workbox-strategies';


/*
config
*/

// Use with precache injection
// eslint-disable-next-line no-restricted-globals,no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);

workbox.core.skipWaiting();
workbox.core.clientsClaim();

/*
caching strategies
*/

// registerRoute(
//   ({url}) => url.host.startsWith('fonts.g'),
//   new CacheFirst({
//     cacheName: 'google-fonts',
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 30,
//       }),
//       new CacheableResponsePlugin({
//         statuses: [0, 200]
//       }),
//     ],
//   })
// );

// registerRoute(
//   ({url}) => url.pathname.startsWith('/posts'),
//   new NetworkFirst()
// );

// registerRoute(
//   ({url}) => url.href.startsWith('http'),
//   // new StaleWhileRevalidate()
//   new NetworkFirst()
// );


// POST https://api.intio.es/ideas/
// POST https://api.intio.es/files/

