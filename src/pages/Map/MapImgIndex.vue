<template>
  <q-layout>
    <q-page class="flex flex-center">
      <div>
        <!-- <q-btn @click="addMarker">Add Circle</q-btn>
        <q-btn @click="addPin">Add Pin</q-btn> -->
        <p>Center is at {{ currentCenter.lat }}, {{ currentCenter.lng }} and the zoom is: {{ currentZoom }}</p>
      </div>

      <l-map style="height:95vh" ref="map" v-model:zoom="zoom">
      <l-image-overlay url="https://vscda.org/wp-content/uploads/2017/03/300x300.png" :bounds="bounds" ></l-image-overlay></l-map>
         

    </q-page>
  </q-layout>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { latLng, imageOverlay } from "leaflet"
import "leaflet/dist/leaflet.css"
import { LMap, LGeoJson, LMarker,LTileLayer, LCircle, LPopup, LCircleMarker , LImageOverlay} from "@vue-leaflet/vue-leaflet";


export default defineComponent({
  name: 'PageIndex',
  components: {
    LMap,
    LGeoJson,
    LTileLayer,
    LCircle,
    LPopup,
    LMarker,
    LCircleMarker
  },

  setup() {



const defaultLocation = latLng(49.0139, 31.2858)
  const currentZoom = ref(11.5)
  const currentCenter = ref(latLng(47.41322, -1.219482))

  // https://github.com/timyboy12345/Themepark-Escape/blob/a1f10bf18d4c41b59286587091d54e2b376d551e/src/components/MapComponent.vue

// var w = 300,
//     h = 300,
//     url = 'http://kempe.net/images/newspaper-big.jpg';

// // calculate the edges of the image, in coordinate space
// var southWest = LMap.unproject([0, h], 3);
// var northEast = LMap.unproject([w, 0], 3);
// var bounds = new L.LatLngBounds(southWest, northEast);

// https://kempe.net/blog/2014/06/14/leaflet-pan-zoom-image.html

    function onMapClick(value) {
      // place the marker on the clicked spot
      alert(value.latlng);
    }

    const zoomUpdate = (zoom) => {
          currentZoom.value = zoom;
      }
    
    const centerUpdate = (center) => {
        currentCenter.value = center;
      }


    // https://medium.com/swlh/create-an-interactive-location-selector-with-vue-js-and-leaflet-5808c55b4636
    // https://vue2-leaflet.netlify.app/examples/simple.html

    // https://github.com/dev-eugen/vpe/blob/master/src/containers/Dashboard/views/ProductsMap.vue

    return {
      zoom: 6,
      mozCenter: [-19.4514005, 34.05761718],
      userLocation : [-19.4514005, 34.05761718],
      defaultLocation,

      currentZoom,
      currentCenter,
      onMapClick,
      centerUpdate,
      zoomUpdate,
      bounds: [
        [0, 0],
        [1000, 1000],
      ],
    };
  }

})
</script>
