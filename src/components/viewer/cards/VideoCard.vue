<template>
  <q-card bordered class="my-card no-shadow q-my-sm">
    <!--        VIDEO -->
    <q-card-section v-if="guideDetails && guideDetails.video_id !==null">
      <div class="row q-col-gutter-xs">
        <div class="text-h5">Film</div>
        <q-space></q-space>
        <q-btn :icon="expandedDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
               @click="expandedVideo = !expandedVideo"/>
      </div>

    </q-card-section>
    <q-slide-transition>
      <div v-show="expandedVideo">
        <!-- <q-separator /> -->
        <q-card-section>
          <movie-viewer :video-id="videoId"
                        :video-metadata="videoMetadata"/>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import {ref} from "vue";
import MovieViewer from 'src/components/viewer/MovieViewer.vue'

const props = defineProps({
  videoMetadata: {
    type: Object,
    default() {
      return null
    }
  },
  videoId: {
    type: String,
    default: null,
  },
  expandedVideo: {
    type: Boolean,
    default: false,
  },
})

const expandedVideo = ref(props.expandedPhotos)
const videoId = ref(props.videoId)
const videoMetadata = ref(props.videoMetadata)

</script>
