<template>
  <q-layout>
    <q-page class="flex flex-center">
      <div>
        <q-btn @click="addMarker">Add Circle</q-btn>
        <q-btn @click="addPin">Add Pin</q-btn>
        <p>Center is at {{ currentCenter.lat }}, {{ currentCenter.lng }} and the zoom is: {{ currentZoom }}</p>

        <p>{{provData}}</p>
        <p>{{markers}}</p>
      </div>

      <l-map style="height:95vh" ref="map" v-model:zoom="zoom"
          :center="[
            userLocation.lat || defaultLocation.lat,
            userLocation.lng || defaultLocation.lng
                    ]"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
      >
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>
        
        <l-circle
          v-for="item in provData"
          :key="item.name"
          :lat-lng="item.latlng"
          :radius="item.radius"
          color="green"
          fillColor="blue"
        >
          <l-popup><p><b>{{ item.name }}</b></p><b>Nº de Clientes:</b>{{ item.radius }}</l-popup>
        </l-circle>

        <l-marker
        v-for="marker in markers"
        :key="marker.id"
        :visible="marker.visible"
        :draggable="marker.draggable"
        :lat-lng.sync="marker.position"
        :icon="marker.icon"
        @click="alert(marker)"
      >
        <l-popup :content="marker.tooltip" />
        <l-tooltip :content="marker.tooltip" />
      </l-marker>
      </l-map>
    </q-page>
  </q-layout>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { latLng } from "leaflet"
import "leaflet/dist/leaflet.css"
import { LMap, LGeoJson, LMarker,LTileLayer, LCircle, LPopup, LCircleMarker } from "@vue-leaflet/vue-leaflet";


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


  const markers = reactive(
    [
    {
      position: { lng: -1.219482, lat: 47.41322 },
      visible: true,
      draggable: true,
    },
    ]);
  const provData = reactive([
      {
        name: 'Maputo',
        latlng: [-25.71647, 32.21191],
        radius: 65000
      },
      {
        name: 'Gaza',
        latlng: [-23.53974, 32.71728],
        radius: 75000
      },
    ])

    function addMarker(){
      const newMarker = {
        name: 'AA',
        latlng: [-24.53974, 32.71728],
        radius: 75000
              };
     provData.push(newMarker);
    }

    function addPin(){
      const newPin = {
          // position: { lat: 50.5505, lng: -0.09 },
          // position: currentCenter,
          // position: [-24.53974, 32.71728],
          position: [currentCenter.value.lat, currentCenter.value.lng],
          draggable: true,
          visible: true,
      };
      markers.push(newPin);
    }

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
      provData,
      markers,
      currentZoom,
      currentCenter,
      addMarker,
      addPin,
      onMapClick,
      centerUpdate,
      zoomUpdate
    };
  }

})
</script>
