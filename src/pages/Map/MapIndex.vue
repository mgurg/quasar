<template>
  <q-layout>
    <q-page class="flex flex-center">
      <div>
        <q-btn @click="addMarker">AAA</q-btn>
      </div>

      <l-map style="height:95vh" ref="map" v-model:zoom="zoom" :center="mozCenter" @dblclick="onMapClick">
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

    const markers = reactive([
  {
    position: { lng: -1.219482, lat: 47.41322 },
    visible: true,
    draggable: true,
  },
  // { position: { lng: -1.571045, lat: 47.457809 } },
  // { position: { lng: -1.560059, lat: 47.739323 } },
  // { position: { lng: -0.922852, lat: 47.886881 } },
  // { position: { lng: -0.769043, lat: 48.231991 } },
  // { position: { lng: 0.395508, lat: 48.268569 } },
  // { position: { lng: 0.604248, lat: 48.026672 } },
  // { position: { lng: 1.2854, lat: 47.982568 } },
  // { position: { lng: 1.318359, lat: 47.894248 } },
  // { position: { lng: 1.373291, lat: 47.879513 } },
  // { position: { lng: 1.384277, lat: 47.798397 } },
  // { position: { lng: 1.329346, lat: 47.754098 } },
  // { position: { lng: 1.329346, lat: 47.680183 } },
  // { position: { lng: 0.999756, lat: 47.635784 } },
  // { position: { lng: 0.86792, lat: 47.820532 } },
  // { position: { lng: 0.571289, lat: 47.820532 } },
  // { position: { lng: 0.439453, lat: 47.717154 } },
  // { position: { lng: 0.439453, lat: 47.61357 } },
  // { position: { lng: -0.571289, lat: 47.487513 } },
  // { position: { lng: -0.615234, lat: 47.680183 } },
  // { position: { lng: -0.812988, lat: 47.724545 } },
  // { position: { lng: -1.054688, lat: 47.680183 } },
  // { position: { lng: -1.219482, lat: 47.41322 } },
]);

    const provData = reactive([
      {
        name: 'Maputo',
        latlng: [-25.71647, 32.21191],
        // radius: getRandomInt(20000, 105000)
        radius: 65000
      },
      {
        name: 'Gaza',
        latlng: [-23.53974, 32.71728],
        radius: 75000
      },
    ])

    function addMarker(){
      provData.push(      {
        name: 'AA',
        latlng: [-24.53974, 32.71728],
        radius: 75000
      },);
    }

    function onMapClick(value) {
      // place the marker on the clicked spot
      alert(value.latlng);
    }
    // https://medium.com/swlh/create-an-interactive-location-selector-with-vue-js-and-leaflet-5808c55b4636
    // https://vue2-leaflet.netlify.app/examples/simple.html

    return {
      zoom: 6,
      mozCenter: [-19.4514005, 34.05761718],
      provData,
      markers,
      addMarker,
      onMapClick
    };
  }

})
</script>
