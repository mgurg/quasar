<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">Files</h5>
      <!-- <h1>{{ time }}</h1> -->

      <!-- https://github.com/btowers/edrans/blob/a25e53b730c4fe9e8a35fc908a662cbeee1402f2/client/src/components/products/ProductNew.vue -->
      <q-uploader ref="uploader" :headers="[{ name: 'X-Custom-Timestamp', value: 1550240306080 }]"
                  :hide-upload-btn="true" accept=".jpg, image/*"
                  color="amber"
                  field-name="file" label="No thumbnails" no-thumbnails style="max-width: 300px" text-color="black"
                  @added="uploadFile" @finish="finished">

      </q-uploader>

      <!-- @added="uploadImage" -->
      <q-btn class="q-ma-sm" @click="listFiles">Fetch file list</q-btn>
      <q-btn class="q-ma-sm" @click="add">Add</q-btn>
      <q-btn class="q-ma-sm" @click="remove">Remove</q-btn>


      <h3>IMGs</h3>

      <div class="row q-col-gutter-xs">
        <div v-for="(file, index) in s3Files" v-bind:key="index" class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
          <q-img :src="download_file(file.uuid)" fit="contain" spinner-color="black" style="height: 100%; width:100% ">
            <q-icon class="absolute all-pointer-events" color="blue-grey-5" name="delete" size="sm"
                    style="top: 8px; right: 8px" @click="delete_file(file.uuid)">
              <q-tooltip>Tooltip</q-tooltip>
            </q-icon>

          </q-img>
        </div>
      </div>
      <span>{{ uploadedFiles }}</span>

      <q-img :ratio="16 / 9" class="q-pa-md" src="https://picsum.photos/1920/1080" style="max-width: 300px;"
             @click="dialog = true">
        <q-icon class="absolute all-pointer-events" color="white" name="file_download" size="32px"
                style="top: 8px; left: 8px ">
          <q-tooltip>Tooltip</q-tooltip>
        </q-icon>
      </q-img>

      <q-dialog v-model="dialog" :maximized="true" persistent transition-hide="slide-down" transition-show="slide-up">
        <q-card class="bg-primary text-white">
          <q-bar>
            <q-space/>

            <q-btn v-close-popup dense flat icon="close">
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-img :fit="cover" src="https://picsum.photos/1920/1080"></q-img>


        </q-card>
      </q-dialog>
    </q-page>
  </div>
  <!-- https://github.com/tharindu1989/aws-test/blob/1a55c019ff859ed1a42237225c47f51c468eea20/ImageViewApp/src/pages/AmazonImage.vue -->
  <!-- https://github.com/bildvitta/quasar-app-extension-steroids/blob/4199ad0f2062126d5933ec962582ce619019ae24/src/components/Uploader.vue -->
  <!-- https://github.com/aaronguostudio/learn-serverless/blob/8785951917088f67d384b6e4ad917eacc6d75524/solutions/uploader/aws-node-s3-uploader/src/pages/Index.vue -->
  <!-- https://github.com/kevinkobori/mewnu-quasar-frontend/blob/24ae29a3dbae85e756473aec1bf97fb8254ab84c/src/trash/UserProfile.vue -->

  <!-- https://stackoverflow.com/questions/66542290/fastapi-upload-to-s3 -->
  <!-- https://github.com/tiangolo/fastapi/issues/2919 -->
  <!-- https://github.com/gauravgola96/FastAPI-Example -->
  <!-- https://www.reddit.com/r/FastAPI/comments/s0kp8m/uploading_fastapi_file_to_s3_bucket/ -->
</template>

<script setup>
import {api, authApi} from "boot/axios";
import {ref} from 'vue'
import {useUserStore} from "stores/user";
import Compressor from 'compressorjs';

// ----------SPEECH --------------

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = SpeechRecognition ? new SpeechRecognition() : false
const text = ref('')
const load = ref(false)
const showMessage = ref(false)
if (recognition) {
  recognition.continous = false
  recognition.lang = 'pt-BR'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
}

// ----------SPEECH --------------
const UserStore = useUserStore();

let s3Files = ref([]);
let uploader = ref("");
let uploadedFiles = ref([]);
let dialog = ref(false)


function uploadFile(file, token = null, tenant_id = null) {

  // let formData = new FormData()
  // formData.append('file', file[0])

  if (token == null)
    token = UserStore.getToken

  new Compressor(file[0], {
    quality: 0.6,
    maxWidth: 1600,
    mimeType: 'image/jpeg',
    success(result) {
      const formData = new FormData();

      // The third parameter is required for server
      formData.append('file', result, result.name);

      // size check
      let img = new Image();
      let objectURL = URL.createObjectURL(result);
      img.onload = function () {
        console.log(img.width, img.height)
      }
      img.src = objectURL

      console.log(result.size, result.type, result.name, result.lastModified)

      api
        .post(process.env.VUE_APP_URL + "/files/", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
          }
        })
        .then((res) => {
          //
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
    },
    error(err) {
      console.log(err.message);
    },
  });

}

function add() {
  uploadedFiles.value.push("b");
}


function remove(uuid) {

  // multiple
  // let forDeletion = ["a"]
  // uploadedFiles.value = uploadedFiles.value.filter(item => !forDeletion.includes(item))

  // single
  uploadedFiles.value = uploadedFiles.value.filter(item => item !== "b")
}

function listFiles() {
  authApi
    .get("/files/index")
    .then((res) => {

      s3Files.value = res.data;

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

function download_file(uuid) {

  return process.env.VUE_APP_URL + "/files/download/" + uuid
}

function delete_file(uuid) {
  authApi
    .delete(process.env.VUE_APP_URL + "/files/" + uuid)
    .then((res) => {

      uploadedFiles.value = uploadedFiles.value.filter(item => item !== uuid)
      listFiles()
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

// function uploaded({ files, xhr }) {
//   // alert('uploaded')
//   let response = JSON.parse(xhr.response)
//   uploadedFiles.value.push(response.uuid);
//   console.log(response)
//   listFiles()
// }

function finished() {


  return new Promise((resolve) => {
    // simulating a delay of 2 seconds
    setTimeout(() => {
      resolve(
        uploader.value.reset()
      )
    }, 1000)
  })


}


// function uploadImage(file, updateProgress) {
//   alert('uploaded')
//   let formData = new FormData()
//   formData.append('file', file[0])

//   authApi
//     .post(process.env.VUE_APP_URL + "/s3/upload/", formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })
//     .then((res) => {
//
//     })
//     .catch((err) => {
//       if (err.response) {
//         console.log(err.response);
//       } else if (err.request) {
//         console.log(err.request);
//       } else {
//         console.log("General Error");
//       }
//     });
// }

// https://github.com/amangeldiakyyew/ilan/blob/81f7a83409a18ab867044c8feceebfcf45f47960/web-app/src/components/AUploader.vue
// https://github.com/timetzhang/QUASAR.fusionworks/blob/a45d86e75d830e4e2f04b659e5710cdab17c3282/src/components/dialogImage.vue


// https://codepen.io/metalsadman/pen/YMvEbr?editors=1011

const getTime = () => {
  const date = new Date()
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hour = date.getHours();

  return `${hour}:${minutes}:${seconds}`
}
const time = ref(getTime())
setInterval(() => time.value = getTime(), 1000)
</script>
