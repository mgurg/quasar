<template>
  <div class="row justify-center centers">
    <div v-if="videoItem !== null && videoRatio <1 && $q.screen.lt.md" 
        style="width: 80vmin; height: 90vmin;" 
        v-html="videoItem.assets.iframe"
    >
  </div>
  <div v-if="videoItem !== null && videoRatio <1 && $q.screen.gt.md" 
        style="width: 40vmin; height: 50vmin;" 
        v-html="videoItem.assets.iframe"
    >
  </div>

    <div v-if="videoItem !== null && videoRatio >=1 && $q.screen.lt.md" 
        fixed-center 
        style="width: 90vmin; height: 80vmin;" 
        v-html="videoItem.assets.iframe"
    ></div>
    <div v-if="videoItem !== null && videoRatio >=1 && $q.screen.gt.md" 
        fixed-center 
        style="width: 50vmin; height: 40vmin;" 
        v-html="videoItem.assets.iframe"
    ></div>
    <!-- {{props.videoMetadata}} -->
  </div>
</template>



<script setup>
import { ref, onBeforeMount } from "vue";
import { authApi } from "boot/axios";
import axios from "axios";

const apiToken = ref(null)
const videoItem = ref(null)



const props = defineProps({
    videoId: {
        type: String,
        default: null,
    },
    videoMetadata:{
      type: Object,
      default() {
        return {
          width: null,
          height: null,
          bitrate: null,
          duration: null,
          framerate: null,
          audioCodec: null,
          samplerate: null,
          videoCodec: null,
          aspectRatio: null
        };
      },
    }
});

const videoRatio = ref(1)
if (props.videoMetadata.width !==null && props.videoMetadata.height !==null){
  videoRatio.value = props.videoMetadata.width / props.videoMetadata.height
}

function getUploadToken() {
  authApi.get("/files/video_upload_token/")
    .then((res) => {
      apiToken.value = res.data.api_token
      
      if (props.videoId != null){
        getVideo();
      }
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error");
      }
    });
}

function getVideo() {
  console.log(props.videoId)
  axios.get("https://sandbox.api.video/videos/" + props.videoId, {
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + apiToken.value
    }
  })
    .then((res) => {
      videoItem.value = res.data
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error: " + res);
      }

    });
}

onBeforeMount(() => {
    getUploadToken();
});

</script>