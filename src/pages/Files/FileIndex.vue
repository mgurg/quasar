<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">Files</h5>

      <q-uploader
        :url="uploadUrl"
        ref="uploader"
        :headers="[{ name: 'X-Custom-Timestamp', value: 1550240306080 }]"
        field-name="file"
        auto-upload
        label="No thumbnails"
        color="amber"
        text-color="black"
        no-thumbnails
        accept=".jpg, image/*"
        style="max-width: 300px"
        @uploaded="uploaded"
        @finish="finished"
      />

      <!-- @added="uploadImage" -->
      <q-btn class="q-ma-sm" @click="listFiles">Fetch file list</q-btn>

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
            <q-icon
              class="absolute all-pointer-events"
              size="sm"
              name="download"
              color="blue-grey-5"
              style="top: 8px; left: 8px"
              @click="openURL(download_file(file.uuid))"
            >
              <q-tooltip>Tooltip</q-tooltip>
            </q-icon>
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

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import { ref, reactive } from 'vue'
import { openURL } from 'quasar'


let s3Files = ref([]);
let uploader = ref("");
let uploadedFiles = ref([]);

export default defineComponent({
  name: "PageIndex",
  setup() {




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
          uploadedFiles.value.filter((uploadedFiles) => uploadedFiles.uuid != uuid)
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


    function uploadFile() {
      alert('upload files')

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
    return {
      s3Files,
      delete_file,
      download_file,
      uploadUrl,
      listFiles,
      uploadImage,
      uploaded,
      uploadFile,
      finished,
      uploader,
      uploadedFiles,
      dialog: ref(false),
      openURL
    };
  },
});
</script>
