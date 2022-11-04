<template>
    <div class="row justify-center">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
            <div class="q-pa-md q-gutter-sm">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" to="/home" />
                    <q-breadcrumbs-el :label="$t('Guides')" icon="tips_and_updates" to="/guides" />
                    <q-breadcrumbs-el :label="$t('Add')" icon="add" />
                </q-breadcrumbs>
            </div>
            <!-- https://github.com/oneriang/quasar_dashboard/blob/main/src/components/Editor.vue -->
            
            <div style="border: 1px solid #c2c2c2; border-radius: 5px; padding-left: 5px;">
        <tip-tap-guide />
        
      </div>
      <div>&nbsp;</div>
      <q-file 
        outlined
        v-model="file" 
        label="Pick video"
        accept="video/*"
        @update:model-value="handleFileUpload()" 
        type="file"
        >
        <template v-slot:prepend>
          <q-icon name="movie" />
        </template>
        <template v-slot:file="{ index, file }">
        <q-chip
          class="full-width q-my-xs"
          :removable="isUploading"
          @remove="cancelFile()"
          square
        >
          <q-linear-progress
            class="absolute-full full-height"
            :value="uploadProgress"
            stripe
            color="green-2"
            track-color="grey-2"
          />

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

    <q-btn @click="listAllVideos()">List videos</q-btn>

    <!-- {{videoList}} -->


    <div v-for="video in videoList">
  {{ video.assets.thumbnail }} <br />
  <!-- <img :src="video.assets.thumbnail" /> -->
        <video controls width="250">
          <source :src="video.assets.mp4" type="video/mp4">
        </video>
    </div>

        </q-page>
    </div>
</template>

<!-- {
    "videoId":"vi4iFvmsLTV9qrTUie2U38iH",
    "title":"inewi-rejestrator-casu-pracy-promo.webm",
    "description":"",
    "panoramic":false,
    "mp4Support":true,
    "publishedAt":"2022-11-04T15:16:51.000Z",
    "createdAt":"2022-11-04T15:16:51.000Z",
    "updatedAt":"2022-11-04T15:16:51.000Z",
    "tags":[
      
    ],
    "metadata":[
      
    ],
    "source":{
      "type":"upload",
      "uri":"/videos/vi4iFvmsLTV9qrTUie2U38iH/source"
    },
    "assets":{
      "iframe":"<iframe src=\"https://embed.api.video/vod/vi4iFvmsLTV9qrTUie2U38iH\" width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"no\" allowfullscreen=\"true\"></iframe>",
      "player":"https://embed.api.video/vod/vi4iFvmsLTV9qrTUie2U38iH",
      "hls":"https://cdn.api.video/vod/vi4iFvmsLTV9qrTUie2U38iH/hls/manifest.m3u8",
      "thumbnail":"https://cdn.api.video/vod/vi4iFvmsLTV9qrTUie2U38iH/thumbnail.jpg",
      "mp4":"https://cdn.api.video/vod/vi4iFvmsLTV9qrTUie2U38iH/mp4/source.mp4"
    },
    "_public":true
  } -->

<script setup>
import { ref } from "vue";
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

const uploadToken = ref("")
const apiToken = ref("")

function getUploadToken(){
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

function uploadVideo(){
    console.log("Dummy VIDEO upload")
}
getUploadToken();
const file = ref(null)
const uploadProgress = ref(0)

function handleFileUpload() {
    isUploading.value=true;
    console.log(file.value)
        // console.log(file.value.files)
        const uploader = new VideoUploader({
            file: file.value,
            uploadToken: uploadToken.value,
            chunkSize: 1024*1024*10, // 10MB
            retries: 10,
        });

        uploader.upload()
        .then((video) => console.log(video))
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

    isUploading.value=false;
    }


const videoList = ref(null)
function listAllVideos(){
  axios.get("https://sandbox.api.video/videos?currentPage=1&pageSize=25", {headers: { 
    'accept': 'application/json', 
    'Authorization': 'Bearer ' + apiToken.value
  }})            
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



    
function signUpButtonPressed(ideaForm) {
    console.log('outside', ideaForm)
    createIdea(ideaForm)
    console.log('Add ok')
}


function cancelButtonPressed() {
    console.log('cancelBtnClick')
    router.push("/ideas");
}


</script>

<style lang="scss"  scoped>
</style>