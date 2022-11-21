<template>

    <q-spinner v-if="videoThumbnail && videoItem === null" color="primary" size="3em" :thickness="10" />

    <div class="row justify-center" v-if="videoItem !== null">

        <!-- <div v-if="videoItem !== null && videoRatio < 1" fixed-center style="width: 60vmin; height: 80vmin;"
        class="justify-center" v-html="videoItem.assets.iframe"></div>

    <div v-if="videoItem !== null && videoRatio > 1" fixed-center style="width: 80vmin; height: 60vmin;"
        class="justify-center" v-html="videoItem.assets.iframe"></div> -->

        <div v-if="videoItem !== null" fixed-center style="width: 60vmin; height: 80vmin;" class="justify-center"
            v-html="videoItem.assets.iframe"></div>


    </div>
    <div class="row justify-center" v-if="videoItem !== null">
        <q-btn v-if="videoItem !== null" outline icon="delete" class="row justify-center q-pt-xs"
            @click="deleteVideo(videoId)" :label="$t('Delete Video')" no-caps />
    </div>


    <q-file v-if="videoItem === null" v-model="file" outlined :label="$t('Pick Video to upload')" accept="video/*"
        @update:model-value="handleFileUpload()" type="file">
        <template v-slot:prepend>
            <q-icon name="ondemand_video" />
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
</template>


<script setup>
import { ref, watch, onBeforeUnmount, onBeforeMount } from "vue";
import { useUserStore } from "stores/user";
import { authApi } from "boot/axios";
import axios from "axios";
import { VideoUploader } from '@api.video/video-uploader'

const props = defineProps({
  videoId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['uploadedVideoId'])

// VIDEO
const apiToken = ref(null)
const uploadToken = ref(null)

const file = ref(null)
const isUploading = ref(false);
const uploadProgress = ref(0)
const videoThumbnail = ref(null)

const videoId = ref(props.videoId)
const videoItem = ref(null)

const UserStore = useUserStore();

const tenantUuid = UserStore.getTenantUuid
const userUuid = UserStore.getCurrentUserId

const enablePooling = ref("false")
var intervalID = null;

function getUploadToken() {
  authApi.get("/files/video_upload_token/")
    .then((res) => {
      uploadToken.value = res.data.upload_token
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

function handleFileUpload() {
  isUploading.value = true;
  console.log(file.value)
  // console.log(file.value.files)
  const uploader = new VideoUploader({
    file: file.value,
    videoName: tenantUuid + "_" + userUuid + "_" + file.value.name,
    uploadToken: uploadToken.value,
    chunkSize: 1024 * 1024 * 10, // 10MB
    retries: 10,
  });

  uploader.upload()
    .then((video) => {
      videoThumbnail.value = true;
      videoId.value = video.videoId;
      enablePooling.value = true;
      console.log(video)
      emit('uploadedVideoId', video.videoId)
    })
    .catch((error) => console.log(error.status, error.message));

  uploader.onProgress((event) => {
    // console.log(`total number of bytes uploaded for this upload: ${event.uploadedBytes}.`);
    // console.log(`total size of the file: ${event.totalBytes}.`);
    // console.log(`number of upload chunks: ${event.chunksCount} .`);
    // console.log(`size of a chunk: ${event.chunksBytes}.`);
    // console.log(`index of the chunk being uploaded: ${event.currentChunk}.`);
    // console.log(`number of bytes uploaded for the current chunk: ${event.currentChunkUploadedBytes}.`);
    uploadProgress.value = event.uploadedBytes / event.totalBytes
  });

  isUploading.value = false;
}


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

          if (res.data.encoding.playable == true) {
            // 
            // videoWidth.value = res.data.encoding.metadata.width;
            // videoHeight.value = res.data.encoding.metadata.height;
            // videoRatio.value = res.data.encoding.metadata.width / res.data.encoding.metadata.height;
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

  }, 5000);
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

function getVideo() {
  axios.get("https://sandbox.api.video/videos/" + videoId.value, {
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

function deleteVideo(video_id) {
  axios.delete("https://sandbox.api.video/videos/" + video_id, {
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + apiToken.value
    }
  })
    .then((res) => {
      console.log(res)
      videoId.value = null;
      videoItem.value = null;
      videoThumbnail.value = null;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error"  + err);
      }

    });
}

onBeforeMount(() => {
    getUploadToken();
});

onBeforeUnmount(() => {
  clearInterval(intervalID);
});


</script>