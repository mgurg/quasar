<template>
    <div class="row q-col-gutter-xs q-pa-md">
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3" v-for="(file, index) in pictures"
            v-bind:key="index">
            <q-img 
                :src="file.url" 
                spinner-color="black" 
                style="height: 100%; 
                width: 100%" 
                fit="contain"
                @click="previewImgObject(index)">
            </q-img>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { api as viewerApi } from "v-viewer";
import VueViewer from "v-viewer";
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
                file_name : null,
                extension: null,
                mimetype:null,
                size: null,
                url: null
            };
        },
    },
});

const pictures = ref(props.picturesList)

console.log(pictures.value)


const sourceImageURLs = ref([]);

sourceImageURLs.value = props.picturesList.map((e) => {
        return {
          'data-source': e.url,
          'src': e.url,
          'alt': e.file_name
        }
      });



function previewURL() {
  const $viewer = viewerApi({
    images: sourceImageURLs.value,
    rotatable: false,
    scalable: false,
    transition: false
  })
  console.log($viewer)
}

function previewImgObject(index) {
      console.log(index)
      const $viewer = viewerApi({

          toolbar: true,
          url: 'data-source',
          initialViewIndex: index,

        images: sourceImageURLs.value,
      })
      console.log($viewer)
    }


</script>