/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxPluginMode is set to "InjectManifest"
 */

import { precacheAndRoute } from 'workbox-precaching'

console.log('Custom Service Worker')
// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)
