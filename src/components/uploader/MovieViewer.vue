<template>
    <div v-if="videoItem !== null" 
        fixed-center 
        style="width: 60vmin; height: 80vmin;" 
        class="justify-center"
        v-html="videoItem.assets.iframe"
    ></div>
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
});

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
  axios.get("https://sandbox.api.video/videos/" + props.videoId, {
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + apiToken.value
    }
  })
    .then((res) => {
      
      videoItem.value = res.data
    //   videoThumbnail.value = res.data.assets.thumbnail
      file.value = null;

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

onBeforeMount(() => {
    getUploadToken();
});

</script>