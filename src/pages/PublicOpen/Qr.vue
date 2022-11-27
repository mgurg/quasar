<template>
  <q-layout>
  <q-page-container>
    <div class="row justify-center">
      <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <div class="q-pa-md">

        <video controls width="250">
          <source src="https://embed.api.video/vod/vi6OW7O2SOawCNi0KgZ6wSkJ" type="video/webm">
          <source src="https://cdn.api.video/vod/vi5jBfdZuZtBRL9ipjdDsKrp/mp4/source.mp4" type="video/mp4">

          Download the
          <a href="https://embed.api.video/vod/vi6OW7O2SOawCNi0KgZ6wSkJ">WEBM</a>
          or
          <a href="https://cdn.api.video/vod/vi5jBfdZuZtBRL9ipjdDsKrp/mp4/source.mp4">MP4</a>video.
        </video>

        <h3>QR CODE</h3>
        <form>
          <input ref="file" v-on:change="handleFileUpload()"  type="file">
</form>

    <!-- <img
      src="https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=https://remontmaszyn.pl/new/8tl+234&choe=UTF-8&chld=M"
      alt="string"
    /> -->

        </div>
      </q-page>
    </div>
  </q-page-container>
  </q-layout>

</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from 'vue-router';
import { api, authApi } from "boot/axios";
import axios from "axios";
import { VideoUploader } from '@api.video/video-uploader'

const file = ref(null)
const uploadToken = ref("")
const apiToken = ref("")

function getUploadToken(){
  authApi.get("/files/video_upload_token/")            
      .then((res) => {
           uploadToken.value = "res.data.upload_token"
           apiToken.value = "res.data.api_token"
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

getUploadToken()

function listAllVideos(){
  axios.get("https://sandbox.api.video/videos?currentPage=1&pageSize=25", {headers: { 
    'accept': 'application/json', 
    'Authorization': 'Bearer 47yczv1m0huXDEg6iyNRqYT9QXmUcMAArHY0Qqzgz0I'
  }})            
      .then((res) => {
           console.log(Object.values(res.data)[0])
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

listAllVideos()

function handleFileUpload() {
        console.log(file.value.files)
        const uploader = new VideoUploader({
            file: file.value.files[0],
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
    });

    }



</script>