<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">Files</h5>

      <!-- https://github.com/btowers/edrans/blob/a25e53b730c4fe9e8a35fc908a662cbeee1402f2/client/src/components/products/ProductNew.vue -->
      <q-uploader
        :hide-upload-btn="true"
        ref="uploader"
        :headers="[{ name: 'X-Custom-Timestamp', value: 1550240306080 }]"
        field-name="file"
        label="No thumbnails"
        color="amber"
        text-color="black"
        no-thumbnails
        accept=".jpg, image/*"
        style="max-width: 300px"
        @added="uploadFile"
        @uploaded="uploaded"
        @finish="finished"
      >
        <!-- <template v-slot:list="scope">
          <q-list separator>
            <q-item v-for="file in scope.files" :key="file.__key">
              <q-item-section>
                <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                <q-item-label caption>Status: {{ file.__status }}</q-item-label>

                <q-item-label caption>{{ file.__sizeLabel }} / {{ file.__progressLabel }}</q-item-label>
              </q-item-section>

              <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                <img :src="file.__img.src" />
              </q-item-section>

              <q-item-section top side>
                <q-btn
                  class="gt-xs"
                  size="12px"
                  flat
                  dense
                  round
                  icon="delete"
                  @click="scope.removeFile(file)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </template>-->
      </q-uploader>

      <!-- @added="uploadImage" -->
      <q-btn class="q-ma-sm" @click="listFiles">Fetch file list</q-btn>
      <q-btn class="q-ma-sm" @click="add">Add</q-btn>
      <q-btn class="q-ma-sm" @click="remove">Remove</q-btn>

      <!-- <div class="q-pa-md q-gutter-sm">
        <div width="100%" v-for="(file, index) in s3Files" v-bind:key="index">
          <q-img
            :src="download_file(file.file_name)"
            spinner-color="black"
            style="height: 140px; max-width: 150px"
          >
            <q-icon
              class="absolute all-pointer-events"
              size="sm"
              name="delete"
              color="white"
              style="top: 8px; right: 8px"
              @click="delete_file(file.file_name)"
            >
              <q-tooltip>Tooltip</q-tooltip>
            </q-icon>
          </q-img>
        </div>
      </div>-->
      <h3>IMGs</h3>

      <div class="row q-col-gutter-xs">
        <div
          class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
          v-for="(file, index) in s3Files"
          v-bind:key="index"
        >
          <q-img
            :src="download_file(file.uuid)"
            spinner-color="black"
            style="height: 100%; width:100% "
            fit="contain"
          >
            <q-icon
              class="absolute all-pointer-events"
              size="sm"
              name="delete"
              color="blue-grey-5"
              style="top: 8px; right: 8px"
              @click="delete_file(file.uuid)"
            >
              <q-tooltip>Tooltip</q-tooltip>
            </q-icon>

            <!-- <q-icon
              class="absolute all-pointer-events"
              size="sm"
              name="download"
              color="blue-grey-5"
              style="top: 8px; left: 8px"
              @click="window.open(download_file(file.uuid))"
            >
              <q-tooltip>Tooltip</q-tooltip>
            </q-icon>-->
          </q-img>
        </div>
      </div>
      <span>{{ uploadedFiles }}</span>

      <q-img
        class="q-pa-md"
        src="https://picsum.photos/1920/1080"
        :ratio="16 / 9"
        @click="dialog = true"
        style="max-width: 300px;"
      >
        <q-icon
          class="absolute all-pointer-events"
          size="32px"
          name="file_download"
          color="white"
          style="top: 8px; left: 8px "
        >
          <q-tooltip>Tooltip</q-tooltip>
        </q-icon>
      </q-img>

      <q-dialog
        v-model="dialog"
        persistent
        transition-show="slide-up"
        transition-hide="slide-down"
        :maximized="true"
      >
        <q-card class="bg-primary text-white">
          <q-bar>
            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>

          <q-img src="https://picsum.photos/1920/1080" :fit="cover"></q-img>
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
import { api } from "boot/axios";
import { ref, reactive } from 'vue'
import Compressor from 'compressorjs';


let s3Files = ref([]);
let uploader = ref("");
let uploadedFiles = ref([]);
let dialog = ref(false)


function uploadFile(file) {
  console.log('AXIOS upload files')

  // let formData = new FormData()
  // formData.append('file', file[0])

  new Compressor(file[0], {
    quality: 0.6,
    success(result) {
      const formData = new FormData();

      // The third parameter is required for server
      formData.append('file', result, result.name);
      // formData.append('file', result);
  api
    .post(process.env.VUE_APP_URL + "/files/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      console.log(res.data);
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
      // // Send the compressed image file to server with XMLHttpRequest.
      // axios.post('/path/to/upload', formData).then(() => {
      //   console.log('Upload success');
      // });
    },
    error(err) {
      console.log(err.message);
    },
  });

  // api
  //   .post(process.env.VUE_APP_URL + "/files/", formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   })
  //   .then((res) => {
  //     console.log(res.data);
  //   })
  //   .catch((err) => {
  //     if (err.response) {
  //       console.log(err.response);
  //     } else if (err.request) {
  //       console.log(err.request);
  //     } else {
  //       console.log("General Error");
  //     }
  //   });

}

function add() {
  uploadedFiles.value.push("b");
}


function remove(uuid) {

  // multiple
  // let forDeletion = ["a"]
  // uploadedFiles.value = uploadedFiles.value.filter(item => !forDeletion.includes(item))

  // single
  uploadedFiles.value = uploadedFiles.value.filter(item => item != "b")
}

function listFiles() {
  api
    .get("/files/index")
    .then((res) => {

      s3Files.value = res.data;
      console.log(res.data);
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

function uploadUrl() {
  console.log(process.env.VUE_APP_URL + "/files/")
  return process.env.VUE_APP_URL + "/files/"
}

function delete_file(uuid) {
  api
    .delete(process.env.VUE_APP_URL + "/files/" + uuid)
    .then((res) => {
      console.log(res.data);
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

function uploaded({ files, xhr }) {
  // alert('uploaded')
  let response = JSON.parse(xhr.response)
  uploadedFiles.value.push(response.uuid);
  console.log(response)
  listFiles()
}

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




function uploadImage(file, updateProgress) {
  alert('uploaded')
  let formData = new FormData()
  formData.append('file', file[0])

  api
    .post(process.env.VUE_APP_URL + "/s3/upload/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      console.log(res.data);
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

    // https://github.com/amangeldiakyyew/ilan/blob/81f7a83409a18ab867044c8feceebfcf45f47960/web-app/src/components/AUploader.vue
    // https://github.com/timetzhang/QUASAR.fusionworks/blob/a45d86e75d830e4e2f04b659e5710cdab17c3282/src/components/dialogImage.vue


    // https://codepen.io/metalsadman/pen/YMvEbr?editors=1011


</script>
