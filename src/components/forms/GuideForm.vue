<template>
    <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
        @submit.prevent>

        <q-input 
            outlined 
            v-model="guideName" 
            :disable="isLoading" 
            :error="!!errors.guideName"
            :error-message="errors.guideName" 
            :label="$t('Guide name')" 
        />

        <div class="tiptap">
          <tip-tap-guide :body-content="tipTapText" @editor-content="logText"/>
        </div>
        <div>
          <movie-uploader :video-id="props.guide.video_id" @uploaded-video-id="keepVideoId" />
        </div>
        <div>
          <photo-uploader @uploaded-photos="listUploadedImgs" :file-list="props.guide.files_guide"/>
        </div>
        <br />

        <div class="row">
            <q-space />
            <q-btn 
                flat 
                type="submit" 
                class="q-mr-lg" 
                icon="cancel" 
                color="red-12" 
                @click="cancelButtonHandle"
                :label="$t('Cancel')"
            />
            <q-btn 
                v-if="props.buttonText == 'Edit'"
                type="submit" 
                class="q-mr-xs" 
                icon="done" 
                color="primary"
                @click="editGuide()"
                :label="$t('Edit')"
            />
            <q-btn 
              v-if="props.buttonText == 'Save'"
                type="submit" 
                class="q-mr-xs" 
                icon="done" 
                color="primary"
                @click="createGuide()"
                :label="$t('Save')"
            />
        </div>
    </q-form>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "stores/user";
import { useField, useForm } from "vee-validate";
import * as yup from 'yup';
import { useRoute, useRouter } from "vue-router";

import TipTapGuide from 'src/components/editor/TipTapGuide.vue'
import MovieUploader from 'src/components/uploader/MovieUploader.vue'
import PhotoUploader from 'src/components/uploader/PhotoUploader.vue'
import { addGuideRequest, editGuideRequest } from 'src/components/api/GuideApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'

const router = useRouter();

const props = defineProps({
  guide: {
    type: Object,
    default() {
      return {
        uuid: null,
        name: '',
        text: '',
        text_jsonb: null,
        video_id: null,
        // video_jsonb: null,
        files_guide: null
      }
    }
  },
  buttonText: {
    type: String,
    default: 'Save',
  },
})

console.log(JSON.stringify(props.buttonText))

let isLoading = ref(false);
let isError = ref(true);
const uploadedVideoId = ref(null)
const uploadedVideoMetadata = ref(null)

const tipTapText = ref(null)


if (props.guide.text_jsonb !== null){
  tipTapText.value = props.guide.text_jsonb;
}
// FORM


const { handleReset } = useForm();
const validationSchema = yup.object({
  guideName: yup.string().required(),

})

const { handleSubmit, errors } = useForm({
  validationSchema
})

const { value: guideName } = useField('guideName', undefined, { initialValue: props.guide.name })

// IMG
const files = ref(null)
let attachments = ref([]);


function cancelButtonHandle() {
  router.push("/guides");
}


function createGuide() {

  let data = {
    "name": guideName.value,
    "text_html": htmlTxt,
    "text_json": jsonTxt,
    "files": uploadedPhotos.value.map(a => a.uuid), //attachments.value.map(a => a.uuid)
    "video_id": uploadedVideoId.value,
    "video_jsonb": uploadedVideoMetadata.value
  }

  isLoading.value = true;

  addGuideRequest(data).then(function (response) {
    console.log(response)
    isLoading.value = false;
    router.push("/guides");
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });

}
function editGuide() {

let data = {
  "name": guideName.value,
  "text_html": htmlTxt,
  "text_jsonb": jsonTxt,
  "files": uploadedPhotos.value.map(a => a.uuid), //attachments.value.map(a => a.uuid)
  "video_id": uploadedVideoId.value,
  "video_jsonb": uploadedVideoMetadata.value
}

isLoading.value = true;

editGuideRequest(props.guide.uuid, data).then(function (response) {
    console.log(response)
    isLoading.value = false;
    router.push("/guides");
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


// VIDEO

function keepVideoId(videoId, videoMetadata){
  console.log("UPLOADED VIDEO_ID: ");
  console.log(videoId);
  console.log("UPLOADED METADATA: ");
  console.log(videoMetadata);
  uploadedVideoId.value = videoId;
  uploadedVideoMetadata.value = videoMetadata;
}


// RICH EDITOR
let jsonTxt = null;
let htmlTxt = null;
function logText(json, html) {
  jsonTxt = json
  htmlTxt = html
}

//IMG

const uploadedPhotos = ref([]);

function listUploadedImgs(images){
  console.log("UPLOADED IMAGES:")
  console.log(JSON.stringify(images))
  uploadedPhotos.value = images;
}

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