<template>
  <q-layout>
    <q-page class="flex flex-center">
      <div class="row q-pa-md">
        <q-input v-model="text" label="Nazwa" outlined/>
        <!-- <q-btn>Add Circle</q-btn> -->
        <q-btn outline @click="addPin">Dodaj</q-btn>
        <!-- <p>Center is at {{ currentCenter.lat }}, {{ currentCenter.lng }} and the zoom is: {{ currentZoom }}</p> -->

        <!-- <p>{{provData}}</p>
        <p>{{markers}}</p>-->
      </div>

      <l-map :crs="crs" :min-zoom="minZoom" style="height: 95vh; width: 95vw">
        <l-image-overlay :bounds="bounds" :url="url"></l-image-overlay>
        <l-marker v-for="star in stars" :key="star.name" :draggable="star.draggable" :lat-lng="star">
          <l-popup :content="star.name"/>
        </l-marker>
      </l-map>
    </q-page>
  </q-layout>
</template>

<script>
import {reactive, ref} from 'vue';
import {LImageOverlay, LMap, LMarker, LPopup} from '@vue-leaflet/vue-leaflet';
import "leaflet/dist/leaflet.css"
import {CRS} from "leaflet"

export default {
  components: {
    LMap,
    LImageOverlay,
    LMarker,
    LPopup
  },

  setup() {

    function addPin() {
      const newPin = {
        name: text.value,
        lng: 100,
        lat: 100,
        draggable: true,
      };
      stars.push(newPin);
    }

    const text = ref('');

    const crs = CRS.Simple;
    //  ^ +y
    //  |
    //  |
    //  +---> +x   (y,x)
    const bounds = [[-26.5, -25], [2000, 3000]];
    const minZoom = -2;

    const stars = reactive([
      {name: 'Sol', lng: 175.2, lat: 145.0, draggable: true,},
      {name: 'Mizar', lng: 41.6, lat: 130.1, draggable: true,},
      {name: 'Krueger-Z', lng: 13.4, lat: 56.5, draggable: true},
      {name: 'Deneb', lng: 218.7, lat: 8.3, draggable: true}
    ])

    return {
      //  url: 'https://www.veryfrenchgangsters.com/include/asset/leaflet/docs/examples/crs-simple/uqm_map_full.png',
      url: process.env.VUE_APP_URL + '/files/download/46557648-ec8b-4b9b-95e3-a3b652146d5e',
      bounds,
      minZoom,
      crs,
      stars,
      text,
      addPin
    };
  }


}
</script>
