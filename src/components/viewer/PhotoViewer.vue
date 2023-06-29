<template>
  <div class="row q-col-gutter-xs q-pa-none">
    <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" v-for="(file, index) in pictures"
         v-bind:key="index">
      <q-img
        :src="file.url"
        spinner-color="black"
        style="height: 220px; width: 100%; border: 1px solid gray;"
        fit="cover"
        @click="previewImgObject(index)">
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-negative text-white">
            Cannot load image
          </div>
        </template>
      </q-img>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import VueViewer, {api as viewerApi} from "v-viewer";
import "viewerjs/dist/viewer.css";


VueViewer.setDefaults({
  zIndex: 2021,
  toolbar: {
    zoomIn: {
      show: 4,
      size: 'large'
    },
    zoomOut: {
      show: 4,
      size: 'large'
    },
    oneToOne: false,
    reset: false,
    prev: {
      show: 4,
      size: 'large'
    },
    play: {
      show: 4,
      size: 'large'
    },
    next: {
      show: 4,
      size: 'large'
    },
    rotateLeft: {
      show: 4,
      size: 'large'
    },
    rotateRight: {
      show: 4,
      size: 'large'
    },
    flipHorizontal: false,
    flipVertical: false,
  }
})

const props = defineProps({
  picturesList: {
    type: Object,
    default() {
      return {
        uuid: null,
        file_name: null,
        extension: null,
        mimetype: null,
        size: null,
        url: null
      };
    },
  },
});

const pictures = ref(props.picturesList)

// console.log(JSON.stringify(props.picturesList))


const sourceImageURLs = ref([]);

sourceImageURLs.value = props.picturesList.map((e) => {
  return {
    'data-source': e.url,
    'src': e.url,
    'alt': e.file_name
  }
});

// console.log(JSON.stringify(sourceImageURLs.value))

function previewURL() {
  const $viewer = viewerApi({
    images: sourceImageURLs.value,
    rotatable: false,
    scalable: false,
    transition: false
  })
}

function previewImgObject(index) {
  const $viewer = viewerApi({
    options: {
      toolbar: true,
      url: 'data-source',
      initialViewIndex: index,
    },
    images: sourceImageURLs.value,
  })
  // console.log($viewer)
}


</script>
