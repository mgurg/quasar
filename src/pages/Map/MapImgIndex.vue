<template>
  <q-layout>
    <q-page class="flex flex-center">
      <l-map style="height: 350px" :crs="crs" :options="{ zoomControl: false }">
        <!--  -->
        <l-image-overlay :url="url" :bounds="bounds"></l-image-overlay>
        <l-marker v-for="star in stars" :lat-lng="star" :key="star.name">
          <l-popup :content="star.name" />
        </l-marker>
      </l-map>
    </q-page>
  </q-layout>
</template>

<script>
import { LMap, LImageOverlay, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import { latLng, CRS } from "leaflet"

export default {
  components: {
    LMap,
    LImageOverlay,
    LMarker,
    LPopup
  },
  data() {
    return {
      url: 'https://www.veryfrenchgangsters.com/include/asset/leaflet/docs/examples/crs-simple/uqm_map_full.png',
      bounds: [[-26.5, -25], [1021.5, 1023]],
      crs: CRS.Simple,
      stars: [
        { name: 'Sol', lng: 175.2, lat: 145.0 },
        { name: 'Mizar', lng: 41.6, lat: 130.1 },
        { name: 'Krueger-Z', lng: 13.4, lat: 56.5 },
        { name: 'Deneb', lng: 218.7, lat: 8.3 }
      ]
    };
  }
}
</script>
