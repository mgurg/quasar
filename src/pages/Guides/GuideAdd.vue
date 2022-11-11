<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/home" />
          <q-breadcrumbs-el :label="$t('Guides')" icon="fact_check" to="/guides" />
          <q-breadcrumbs-el :label="$t('Add')" icon="add" />
        </q-breadcrumbs>
      </div>
      <!-- https://github.com/oneriang/quasar_dashboard/blob/main/src/components/Editor.vue -->

      <div style="border: 1px solid #c2c2c2; border-radius: 5px; padding-left: 5px;">
        <tip-tap-guide />

      </div>
      <div>&nbsp;</div>
      <div class="row justify-center">
      <q-img :src="videoThumbnail" v-if="videoThumbnail && videoItem === null"></q-img>
      <div v-if="videoItem !== null && videoRatio <1" fixed-center style="width: 60vmin; height: 80vmin;" class="justify-center" v-html="videoItem.assets.iframe"></div>
      <div v-if="videoItem !== null && videoRatio >1" fixed-center style="width: 80vmin; height: 60vmin;" class="justify-center" v-html="videoItem.assets.iframe"></div>
      <!-- <div v-if="videoItem !== null" fixed-center :style="{ height: 95 * videoRatio + 'vmin' }+ ';' + { width: 95 * videoRatio + 'vmin' }" v-html="videoItem.assets.iframe"></div> -->
      </div>
      
      <q-file outlined v-model="file" label="Pick video" accept="video/*" @update:model-value="handleFileUpload()"
        type="file">
        <template v-slot:prepend>
          <q-icon name="movie" />
        </template>
        <template v-slot:file="{ index, file }">
          <q-chip class="full-width q-my-xs" :removable="isUploading" @remove="cancelFile()" square>
            <q-linear-progress class="absolute-full full-height" :value="uploadProgress" stripe color="green-2"
              track-color="grey-2" />

            <q-avatar>
              <q-icon name="photo" />
            </q-avatar>

            <div class="ellipsis relative-position">
              {{ file.name }}
            </div>

            <q-tooltip>
              {{ file.name }}
            </q-tooltip>
          </q-chip>
        </template>
      </q-file>


      <br />

      <q-btn outline class="q-mx-xs" @click="listAllVideos()">List videos</q-btn>

      <!-- {{videoItem}} -->
      <p>{{ videoRatio }} - {{videoWidth}} / {{ videoHeight}}</p>
      <!-- <q-img :src="video.assets.thumbnail" style="height: 140px; max-width: 150px" @click="PlayVideo()"></q-img>
      <div fixed-center style="width: 95vmin; height: 95vmin;" v-html="video.assets.iframe"></div> -->
      <br />
      <!-- <iframe src="https://embed.api.video/vod/vi7fOWjmShIUdDmF8qRIJVx2" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="true"></iframe> -->
      <div v-for="video in videoList">
        <br />
        <q-btn icon="delete" @click="deleteVideo(video.videoId)">{{ video.title }}</q-btn>



      </div>





    </q-page>
  </div>
</template>


<script setup>
import { ref, watch, onBeforeUnmount } from "vue";
import { authApi } from "boot/axios";
import { useRouter } from "vue-router";
import axios from "axios";
import { VideoUploader } from '@api.video/video-uploader'
import TipTapGuide from 'src/components/editor/TipTapGuide.vue'

const router = useRouter();

const video = ref(null)
let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let isUploading = ref(false);
let alert = ref(false);

const uploadToken = ref("")
const apiToken = ref("")
let videoThumbnail = ref(null)
// let videoId = ref("vi3WRVVz5JvEyOfRdPvi9KJH")
let videoId = ref(null)
let videoWidth = ref(null)
let videoHeight = ref(null)
let videoRatio = ref(null)


function createIdea(body) {
  isLoading.value = true;
  authApi
    .post("/guides/", body)
    .then((res) => {
      console.log(res.data);
      isLoading.value = false;
      router.push("/ideas");
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

function getUploadToken() {
  authApi.get("/files/video_upload_token/")
    .then((res) => {
      uploadToken.value = res.data.upload_token
      apiToken.value = res.data.api_token
      console.log(res.data)
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


getUploadToken();

const file = ref(null)
const uploadProgress = ref(0)

function handleFileUpload() {
  isUploading.value = true;
  console.log(file.value)
  // console.log(file.value.files)
  const uploader = new VideoUploader({
    file: file.value,
    videoName: "fca72d24-5211-4a3e-95fe-d9549648e2d3",
    uploadToken: uploadToken.value,
    chunkSize: 1024 * 1024 * 10, // 10MB
    retries: 10,
  });

  uploader.upload()
    .then((video) => {
      videoThumbnail.value = video.assets.thumbnail;
      videoId.value = video.videoId;
      enablePooling.value = true;
      console.log(video)
    })
    .catch((error) => console.log(error.status, error.message));

  uploader.onProgress((event) => {
    console.log(`total number of bytes uploaded for this upload: ${event.uploadedBytes}.`);
    console.log(`total size of the file: ${event.totalBytes}.`);
    console.log(`number of upload chunks: ${event.chunksCount} .`);
    console.log(`size of a chunk: ${event.chunksBytes}.`);
    console.log(`index of the chunk being uploaded: ${event.currentChunk}.`);
    console.log(`number of bytes uploaded for the current chunk: ${event.currentChunkUploadedBytes}.`);
    uploadProgress.value = event.uploadedBytes / event.totalBytes
  });

  isUploading.value = false;
}


const videoList = ref(null)
const videoItem = ref(null)

function listAllVideos() {
  axios.get("https://sandbox.api.video/videos?currentPage=1&pageSize=25", {
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + apiToken.value
    }
  })
    .then((res) => {
      videoList.value = res.data.data
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
  axios.get("https://sandbox.api.video/videos/" + videoId.value, {
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + apiToken.value
    }
  })
    .then((res) => {
      console.log(res.data);
      videoItem.value = res.data
      videoThumbnail.value = res.data.assets.thumbnail
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


function deleteVideo() {

  axios.delete("https://sandbox.api.video/videos/" + videoId.value, {
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + apiToken.value
    }
  })
    .then((res) => {
      console.log(res)
      videoId.value = null;
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


const enablePooling = ref("false")
var intervalID = null;

function checkStatus() {
  intervalID = setInterval(() => {

    if (videoId.value !== null) {
      console.log("Checking API")
      axios.get("https://sandbox.api.video/videos/" + videoId.value + "/status", {
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer ' + apiToken.value
        }
      })
        .then((res) => {

          if (res.data.encoding.playable == true){
            console.log(res.data);
            videoWidth.value = res.data.encoding.metadata.width;
            videoHeight.value = res.data.encoding.metadata.height;
            videoRatio.value = res.data.encoding.metadata.width / res.data.encoding.metadata.height;
            console.log("Downloading single Video");
            getVideo();
          }
          enablePooling.value = !res.data.encoding.playable;
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
      // enablePooling.value = false;
    }

  }, 2000);
}




watch(enablePooling, (newValue, oldValue) => {

  console.log("Toggle to " + newValue)
  if (newValue === true) {
    checkStatus()
  }
  if (newValue === false) {
    clearInterval(intervalID);
  }
});

onBeforeUnmount(() => {
  clearInterval(intervalID);
});

</script>

<style lang="scss"  scoped>

</style>