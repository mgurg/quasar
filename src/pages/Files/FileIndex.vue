<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">Files</h5>
      <q-btn class="q-ma-sm" @click="listFiles">Fetch file list</q-btn>

      <q-list
        dense
        bordered
        padding
        class="rounded-borders"
        v-for="(file, index) in s3Files"
        v-bind:key="index"
      >
        <q-item>
          <!-- clickable v-ripple -->
          <q-item-section>{{ file.name }}</q-item-section>
        </q-item>
      </q-list>

      <div class="q-pa-md q-gutter-sm">
        <div width="100%" v-for="img in imgs" v-bind:key="img.id">
          <q-img :src="img.img" spinner-color="black" style="height: 140px; max-width: 150px">
            <q-icon
              class="absolute all-pointer-events"
              size="sm"
              name="delete"
              color="white"
              style="top: 8px; right: 8px"
              @click="deleteFile(img.id)"
            >
              <q-tooltip>Tooltip</q-tooltip>
            </q-icon>
          </q-img>
        </div>
      </div>
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

let s3Files = ref([]);

export default defineComponent({
  name: "PageIndex",
  setup() {
    const imgs = ref([
      { "id": 1, "img": download_file("Cat03.jpg") },
      { "id": 2, "img": download_file("Blue_morpho_butterfly.jpg") },
      { "id": 3, "img": "https://placeimg.com/500/300/nature?t=3" },
      { "id": 4, "img": "https://placeimg.com/500/300/nature?t=4" },
    ])


    function deleteFile(id) {
      alert(id);
    }

    function listFiles() {
      api
        .get("/s3/list_files")
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

    function download_file(filename) {

      return process.env.VUE_APP_URL + "/s3/get_s3_obj/?s3_obj=" + filename
    }



    return {
      imgs,
      s3Files,
      deleteFile,
      listFiles
    };
  },
});
</script>
