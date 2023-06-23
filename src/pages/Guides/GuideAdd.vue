<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs active-color="grey" class="q-ma-sm text-grey">
        <template v-slot:separator>
          <q-icon
            color="grey"
            name="chevron_right"
            size="1.5em"
          />
        </template>
        <q-breadcrumbs-el icon="home" to="/home"/>
        <q-breadcrumbs-el :label="$t('Guides')" icon="subject" to="/guides"/>
        <q-breadcrumbs-el :label="$t('Add')" icon="add"/>
      </q-breadcrumbs>

      <!--      <q-card bordered class="my-card no-shadow q-mt-sm q-mb-md">-->
      <!--        <q-card-section>-->
      <!--          <q-list>-->
      <!--            <q-item class="q-px-none">-->

      <!--              <q-item-section>-->
      <!--                <q-item-label class="text-h6">{{ $t("New guide") }}</q-item-label>-->

      <!--                <q-item-label v-if="itemUuid===null" caption>-->
      <!--                  Tworzysz zgłoszenie <span class="text-weight-bold">nieprzypisane do żadnego urządzenia</span>.-->
      <!--                </q-item-label>-->
      <!--     -->
      <!--              </q-item-section>-->
      <!--            </q-item>-->

      <!--          </q-list>-->
      <!--        </q-card-section>-->
      <!--      </q-card>-->


      <!-- https://github.com/oneriang/quasar_dashboard/blob/main/src/components/Editor.vue -->

      <q-card bordered class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section :class="$q.screen.gt.xs ? 'q-px-md':'q-px-xs'">
          <guide-form v-if="showForm === true"
                      :item-name="itemName"
                      @cancelBtnClick="cancelButtonPressed"
                      @guideFormBtnClick="addButtonPressed"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>


<script setup>
import {onBeforeMount, onBeforeUnmount, ref, watch} from "vue";
import GuideForm from 'components/forms/guide/GuideForm.vue'
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "stores/user";
import {authApi} from "boot/axios";
import axios from "axios";
import {VideoUploader} from '@api.video/video-uploader'
import 'viewerjs/dist/viewer.css'
import {addGuideRequest} from "components/api/GuideApiClient";
import {errorHandler} from "components/api/errorHandler";
import {getOneItemRequest} from "components/api/ItemApiClient";

const route = useRoute()
const router = useRouter();
const UserStore = useUserStore();

const tenantUuid = UserStore.getTenantUuid
const userUuid = UserStore.getCurrentUserId


const video = ref(null)
let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let showForm = ref(false);
const itemUuid = ref(null);
const itemName = ref(null);
let isUploading = ref(false);
let alert = ref(false);

let jsonTxt = null;
let htmlTxt = null;

function logText(json, html) {
  jsonTxt = json
  htmlTxt = html
}

const uploadToken = ref("")
const apiToken = ref("")
let videoThumbnail = ref(null)
// let videoId = ref("vi3WRVVz5JvEyOfRdPvi9KJH")
let videoId = ref(null)
let videoWidth = ref(null)
let videoHeight = ref(null)
let videoRatio = ref(null)


function createGuide(formData) {
  formData["item_uuid"] = itemUuid.value
  // console.log(formData)
  addGuideRequest(formData).then(function (response) {
    console.log(response)
    isLoading.value = false;
    if (itemUuid.value !== null) {
      router.push("/items/" + itemUuid.value);
    } else {
      router.push("/guides");
    }
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });
}

function getUploadToken() {
  authApi.get("/files/video_upload_token/")
    .then((res) => {
      uploadToken.value = res.data.upload_token
      apiToken.value = res.data.api_token

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
    videoName: tenantUuid + "_" + userUuid + "_" + file.value.name,
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

const videoItem = ref(null);

function getVideo() {
  axios.get("https://sandbox.api.video/videos/" + videoId.value, {
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + apiToken.value
    }
  })
    .then((res) => {

      videoItem.value = res.data
      videoThumbnail.value = res.data.assets.thumbnail
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
      videoItem.value = null;
      videoThumbnail.value = null;
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

          if (res.data.encoding.playable === true) {

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

  }, 5000);
}

function cancelButtonHandle() {
  router.push("/guides");
}

function submit() {
  router.push("/guides");
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


function addButtonPressed(itemForm) {
  // console.log(itemForm)
  createGuide(itemForm)
}

function cancelButtonPressed() {
  router.push("/guides");
}

onBeforeUnmount(() => {
  clearInterval(intervalID);
});

function getItemDetails(uuid) {
  isLoading.value = true;

  getOneItemRequest(uuid).then(function (response) {
    console.log(response.data.name);
    itemName.value = response.data.name
    showForm.value = true;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });

}

onBeforeMount(() => {
  if ((route.query.item !== undefined) && (route.query.item !== null) && (route.query.item !== "")) {
    console.log("Query: " + route.query.item);
    itemUuid.value = route.query.item
    getItemDetails(route.query.item);
  } else {
    showForm.value = true;
  }
  isLoading.value = false
});
</script>

<style lang="scss" scoped>
.tiptap {
  border: 1px solid #c2c2c2;
  border-radius: 5px;
  padding-left: 5px;
}

.tiptap:focus-within {
  transition: 0.3s;
  border: 2px solid #1976d2 !important;
}

// .tiptap:hover {
//   transition: 0.5s;
//   border: 1px solid #000000 !important;
// }
</style>
