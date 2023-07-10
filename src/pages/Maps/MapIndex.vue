<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md">
        <q-form
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          class="q-gutter-md"
          spellcheck="false"
          @submit.prevent
        >
          <q-input v-model="text" label="Nazwa" outlined/>
          <q-input v-model="text" label="Opis" outlined/>


          <q-btn outline @click="addPin">Dodaj Pin</q-btn>
          <q-btn outline @click="addPin">Dodaj</q-btn>
        </q-form>
      </div>

      <l-map :crs="crs" :min-zoom="minZoom" style="height: 80%; width: 100%">
        <l-image-overlay :bounds="bounds" :url="url"></l-image-overlay>
        <l-marker v-for="star in stars" :key="star.name" :draggable="star.draggable" :lat-lng="star">
          <l-popup :content="star.name"/>
        </l-marker>
      </l-map>
    </q-page>
  </div>
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
